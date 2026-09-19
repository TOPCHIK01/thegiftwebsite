import {
  GRAVITY,
  MAX_FALL,
  MOVE_ACCEL,
  MOVE_MAX,
  FRICTION,
  JUMP_VEL,
  COYOTE_TIME,
  JUMP_BUFFER,
  INVINCIBLE_TIME,
  KNOCKBACK_X,
  KNOCKBACK_Y,
} from './constants'
import { moveX, moveY } from './collision'

export class Player {
  constructor(spawn) {
    this.w = 42
    this.h = 56
    this.reset(spawn)
  }

  reset(spawn) {
    this.x = spawn.x
    this.y = spawn.y
    this.vx = 0
    this.vy = 0
    this.face = 1
    this.grounded = false
    this.groundPlat = null
    this.coyote = 0
    this.jumpBuf = 0
    this.invincible = 0
    this.walkT = 0
    this.squash = 0
    this.wasGrounded = false
  }

  queueJump() {
    this.jumpBuf = JUMP_BUFFER
  }

  hurt(dirX) {
    this.invincible = INVINCIBLE_TIME
    this.vx = dirX * KNOCKBACK_X
    this.vy = -KNOCKBACK_Y
    this.grounded = false
  }

  // events: { onJump(), onLand() }
  update(dt, input, solids, events) {
    // Горизонтальное движение
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0)
    if (dir !== 0) {
      this.vx += dir * MOVE_ACCEL * dt
      this.face = dir
    } else {
      const f = FRICTION * dt
      this.vx = Math.abs(this.vx) <= f ? 0 : this.vx - Math.sign(this.vx) * f
    }
    this.vx = Math.max(-MOVE_MAX, Math.min(MOVE_MAX, this.vx))

    // Таймеры
    this.coyote = this.grounded ? COYOTE_TIME : Math.max(0, this.coyote - dt)
    this.jumpBuf = Math.max(0, this.jumpBuf - dt)
    this.invincible = Math.max(0, this.invincible - dt)
    this.squash = Math.max(0, this.squash - dt * 4)

    // Прыжок (буфер + coyote time)
    if (this.jumpBuf > 0 && (this.grounded || this.coyote > 0)) {
      this.vy = -JUMP_VEL
      this.grounded = false
      this.groundPlat = null
      this.coyote = 0
      this.jumpBuf = 0
      events.onJump?.()
    }

    // Переменная высота прыжка: отпустил кнопку — падаешь быстрее.
    if (!input.jumpHeld && this.vy < 0) this.vy += GRAVITY * dt * 1.7
    this.vy = Math.min(MAX_FALL, this.vy + GRAVITY * dt)

    // Движущаяся платформа несёт игрока.
    if (this.groundPlat && this.groundPlat.delta) {
      this.x += this.groundPlat.delta.x
      this.y += this.groundPlat.delta.y
    }

    // Интеграция + столкновения
    moveX(this, solids, dt)
    this.wasGrounded = this.grounded
    const ground = moveY(this, solids, dt)
    this.grounded = Boolean(ground)
    this.groundPlat = ground && ground.move ? ground : null

    if (this.grounded && !this.wasGrounded) {
      this.squash = 1
      events.onLand?.()
    }

    // Анимация ходьбы
    if (this.grounded && Math.abs(this.vx) > 20) {
      this.walkT += dt * (Math.abs(this.vx) / MOVE_MAX) * 10
    }

    // Не даём выйти за левый край уровня
    if (this.x < 0) {
      this.x = 0
      this.vx = Math.max(0, this.vx)
    }
  }

  get rect() {
    return this
  }

  get centerX() {
    return this.x + this.w / 2
  }

  get centerY() {
    return this.y + this.h / 2
  }
}
