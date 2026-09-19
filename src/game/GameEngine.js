import {
  VIEW_H,
  VIEW_MIN_W,
  VIEW_MAX_W,
  START_LIVES,
  FINALE_DURATION,
  JUMP_VEL,
  PALETTE,
} from './constants'
import { aabb, pointInRect } from './collision'
import { Input } from './input'
import { Player } from './Player'
import { Camera } from './Camera'
import { Particles } from './particles'
import { GameAudio } from './audio'
import { drawBackground } from './render/background'
import { drawWorld } from './render/world'
import {
  drawPlayer,
  drawEnemy,
  drawCollectible,
  drawGoal,
} from './render/entities'

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

// Движок игры: один requestAnimationFrame-loop, физика в логических
// единицах, React получает события через onEvent(type, payload).
// События: 'hud' | 'over' | 'won' | 'pause-toggle' | 'goal' | 'checkpoint'
export class GameEngine {
  constructor(canvas, { onEvent, reduceFx = false } = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.emit = onEvent ?? (() => {})
    this.reduceFx = reduceFx
    this.audio = new GameAudio()
    this.input = new Input(
      () => this._jumpPressed(),
      () => this.emit('pause-toggle'),
    )
    this.raf = null
    this.running = false
    this.paused = false
    this.t = 0
    this.viewW = 1280
    this.viewH = VIEW_H
    this.scale = 1
    this.xOff = 0
    this.yOff = 0
  }

  load(level) {
    this.level = level
    this._buildRuntime()
  }

  _buildRuntime() {
    const L = this.level
    this.platforms = L.platforms.map((p) => ({
      ...p,
      baseX: p.x,
      baseY: p.y,
      phase: 0,
      delta: { x: 0, y: 0 },
    }))
    this.items = L.collectibles.map((c) => ({ ...c, taken: false }))
    this.enemies = L.enemies.map((e) => ({
      x: e.minX,
      y: e.y,
      w: 36,
      h: 34,
      minX: e.minX,
      maxX: e.maxX,
      dir: 1,
      speed: e.speed,
    }))
    this.checkpoints = L.checkpoints.map((c) => ({ ...c, activated: false }))
    this.goal = { ...L.goal, lidLift: 0 }
    this.respawn = { ...L.spawn }
    this.player = new Player(L.spawn)
    this.camera = new Camera(L.width)
    this.camera.setView(this.viewW, this.viewH)
    this.camera.snap(this.player)
    this.particles = new Particles(this.reduceFx)
    this.lives = START_LIVES
    this.hearts = 0
    this.gifts = 0
    this.totalHearts = this.items.filter((i) => i.type === 'heart').length
    this.totalGifts = this.items.filter((i) => i.type === 'gift').length
    this.nearGoal = false
    this.finale = 0
    this.finished = false
  }

  // Canvas подгоняется под css-размер; логическая высота всегда VIEW_H.
  resize(cssW, cssH, dpr) {
    if (!cssW || !cssH) return
    this.canvas.width = Math.round(cssW * dpr)
    this.canvas.height = Math.round(cssH * dpr)
    this.viewW = clamp((VIEW_H * cssW) / cssH, VIEW_MIN_W, VIEW_MAX_W)
    // Масштаб по меньшей из сторон: мир всегда виден целиком
    // (иначе на ultrawide обрезается низ, на портрете — «мёртвая» зона).
    this.scale = Math.min(
      this.canvas.width / this.viewW,
      this.canvas.height / this.viewH,
    )
    // Логическая область канваса может превышать вид — центрируем,
    // остаток каждый кадр заливается небом в render().
    const logicalW = this.canvas.width / this.scale
    const logicalH = this.canvas.height / this.scale
    this.xOff = Math.max(0, (logicalW - this.viewW) / 2)
    this.yOff = Math.max(0, (logicalH - this.viewH) / 2)
    this.camera?.setView(this.viewW, this.viewH)
    if (!this.running || this.paused) this.render()
  }

  start() {
    if (this.running) return
    this.running = true
    this.paused = false
    this.input.attach()
    this.audio.startMusic()
    this.last = performance.now()
    this.raf = requestAnimationFrame(this._loop)
    this._emitHud()
  }

  stop() {
    this.running = false
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = null
    this.input.detach()
    this.audio.stopMusic()
  }

  setPaused(p) {
    this.paused = p
    if (p) this.input.reset()
    else this.last = performance.now()
  }

  setMuted(m) {
    this.audio.setMuted(m)
  }

  // Рестарт уровня: пересобирает состояние, слушатели не трогает.
  reset() {
    this._buildRuntime()
    this.paused = false
    this.input.reset()
    this.last = performance.now()
    this._emitHud()
  }

  _emitHud() {
    this.emit('hud', {
      lives: this.lives,
      hearts: this.hearts,
      gifts: this.gifts,
      totalHearts: this.totalHearts,
      totalGifts: this.totalGifts,
    })
  }

  _loop = (ts) => {
    if (!this.running) return
    const dt = Math.min(0.05, (ts - this.last) / 1000)
    this.last = ts
    if (!this.paused) {
      this.t += dt
      if (this.finale > 0) this._updateFinale(dt)
      else this._update(dt)
      this.render()
    }
    this.raf = requestAnimationFrame(this._loop)
  }

  // Прыжок рядом с подарком = «открыть».
  _jumpPressed() {
    if (this.finished || this.paused) return
    if (this.nearGoal) this._startFinale()
    else this.player.queueJump()
  }

  // Тап по экрану — если попал по подарку и игрок рядом, открываем.
  handleTap(clientX, clientY) {
    if (this.finished || this.paused || !this.nearGoal) return
    const rect = this.canvas.getBoundingClientRect()
    const logicalW = this.canvas.width / this.scale
    const logicalH = this.canvas.height / this.scale
    const wx =
      ((clientX - rect.left) / rect.width) * logicalW -
      this.xOff +
      this.camera.x
    const wy =
      ((clientY - rect.top) / rect.height) * logicalH - this.yOff
    const goalRect = { x: this.goal.x - 95, y: this.goal.y - 200, w: 190, h: 200 }
    if (pointInRect(wx, wy, goalRect)) this._startFinale()
  }

  _startFinale() {
    if (this.finale > 0) return
    this.finale = 0.001
    this.input.reset()
    this.audio.play('win')
    this.particles.confetti(this.goal.x, this.goal.y - 160)
    this.particles.sparkle(this.goal.x, this.goal.y - 120)
  }

  _update(dt) {
    // Игра окончена (over/won): мир больше не обновляем,
    // только частицы продолжают догорать за экраном результата.
    if (this.finished) {
      this.particles.update(dt)
      return
    }

    const p = this.player

    // Движущиеся платформы (ping-pong от базовой позиции).
    for (const pl of this.platforms) {
      if (!pl.move) continue
      const prevX = pl.x
      const prevY = pl.y
      const dist = Math.abs(pl.move.dist)
      pl.phase = (pl.phase + pl.move.speed * dt) % (2 * dist)
      const off = pl.phase <= dist ? pl.phase : 2 * dist - pl.phase
      const signed = Math.sign(pl.move.dist) * off
      if (pl.move.axis === 'x') pl.x = pl.baseX + signed
      else pl.y = pl.baseY + signed
      pl.delta.x = pl.x - prevX
      pl.delta.y = pl.y - prevY
    }

    // Игрок
    p.update(dt, this.input, this.platforms, {
      onJump: () => {
        this.audio.play('jump')
        this.particles.dust(p.centerX, p.y + p.h)
      },
      onLand: () => this.particles.dust(p.centerX, p.y + p.h),
    })

    // Враги патрулируют.
    for (const e of this.enemies) {
      if (e.dead) continue
      e.x += e.dir * e.speed * dt
      if (e.x <= e.minX) {
        e.x = e.minX
        e.dir = 1
      } else if (e.x + e.w >= e.maxX) {
        e.x = e.maxX - e.w
        e.dir = -1
      }
    }

    // Шипы и враги — урон.
    for (const h of this.level.hazards) {
      const pad = { x: h.x + 4, y: h.y + 8, w: h.w - 8, h: h.h - 8 }
      if (aabb(p, pad)) {
        this._hurtPlayer(h.x + h.w / 2)
        break
      }
    }
    for (const e of this.enemies) {
      if (e.dead) continue
      const pad = { x: e.x + 4, y: e.y + 4, w: e.w - 8, h: e.h - 8 }
      if (!aabb(p, pad)) continue
      // Прыжок сверху: враг исчезает облачком дыма, игрок отскакивает.
      const stomping = p.vy > 0 && p.y + p.h - e.y < e.h * 0.65
      if (stomping) {
        e.dead = true
        p.vy = this.input.jumpHeld ? -JUMP_VEL * 0.75 : -JUMP_VEL * 0.5
        p.grounded = false
        this.particles.poof(e.x + e.w / 2, e.y + e.h / 2)
        this.audio.play('stomp')
      } else {
        this._hurtPlayer(e.x + e.w / 2)
      }
    }

    // Собираем предметы.
    for (const c of this.items) {
      if (c.taken) continue
      const r = { x: c.x - 18, y: c.y - 18, w: 36, h: 36 }
      if (!aabb(p, r)) continue
      c.taken = true
      if (c.type === 'heart') {
        this.hearts++
        this.particles.hearts(c.x, c.y)
      } else {
        this.gifts++
        this.particles.sparkle(c.x, c.y)
      }
      this.audio.play('collect')
      this._emitHud()
    }

    // Чекпоинты.
    for (const c of this.checkpoints) {
      if (!c.activated && p.centerX > c.x) {
        c.activated = true
        this.respawn = { x: c.x - 20, y: c.y - 80 }
        this.particles.sparkle(c.x, c.y - 60, '#d97a94')
        this.audio.play('checkpoint')
        this.emit('checkpoint')
      }
    }

    // Падение в яму.
    if (p.y > this.level.height + 60) {
      this.lives--
      this._emitHud()
      this.audio.play('hit')
      if (this.lives <= 0) {
        this.finished = true
        this.emit('over')
      } else {
        p.reset(this.respawn)
        p.invincible = 1.2
        this.camera.snap(p)
      }
      return
    }

    // Близость к финальному подарку.
    const near =
      Math.abs(p.centerX - this.goal.x) < 120 &&
      p.y + p.h > this.goal.y - 200
    if (near !== this.nearGoal) {
      this.nearGoal = near
      this.emit('goal', near)
    }

    this.particles.update(dt)
    this.camera.follow(p, dt)
  }

  _hurtPlayer(sourceX) {
    const p = this.player
    if (p.invincible > 0 || this.finished) return
    this.lives--
    this._emitHud()
    if (this.lives <= 0) {
      this.finished = true
      this.audio.play('hit')
      this.emit('over')
      return
    }
    this.audio.play('hit')
    const dir = p.centerX < sourceX ? -1 : 1
    p.hurt(dir)
    this.particles.sparkle(p.centerX, p.centerY, '#d97a94')
  }

  _updateFinale(dt) {
    this.finale += dt
    // Крышка поднимается плавно.
    this.goal.lidLift = clamp((this.finale - 0.4) / 1.4, 0, 1)
    if (this.finale > 0.5 && this.finale < 0.6) {
      this.particles.confetti(this.goal.x, this.goal.y - 160)
    }
    // Камера мягко центрирует подарок.
    const targetX = clamp(
      this.goal.x - this.viewW / 2,
      0,
      this.level.width - this.viewW,
    )
    this.camera.x += (targetX - this.camera.x) * Math.min(1, dt * 2.5)
    this.particles.update(dt)
    if (this.finale >= FINALE_DURATION && !this.finished) {
      this.finished = true
      this.emit('won', {
        hearts: this.hearts,
        gifts: this.gifts,
        totalHearts: this.totalHearts,
        totalGifts: this.totalGifts,
      })
    }
  }

  render() {
    const { ctx, canvas } = this
    if (!this.platforms) return
    // На узких экранах viewW зажимается в VIEW_MIN_W и игровой view
    // занимает только верх канваса. Заливаем весь битмап цветом неба —
    // иначе ниже viewH остаются «призраки» старых кадров (упавший игрок).
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.fillStyle = PALETTE.skyBottom
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.setTransform(
      this.scale,
      0,
      0,
      this.scale,
      this.xOff * this.scale,
      this.yOff * this.scale,
    )

    drawBackground(ctx, this.camera, this.viewW, this.viewH, this.t)

    ctx.save()
    ctx.translate(-this.camera.x, 0)

    drawWorld(
      ctx,
      {
        platforms: this.platforms,
        hazards: this.level.hazards,
        checkpoints: this.checkpoints,
      },
      this.camera,
      this.viewW,
      this.viewH,
      this.t,
    )

    for (const c of this.items) {
      if (!c.taken) drawCollectible(ctx, c, this.t)
    }
    for (const e of this.enemies) {
      if (!e.dead) drawEnemy(ctx, e, this.t)
    }

    drawGoal(ctx, this.goal, this.t, this.nearGoal, this.goal.lidLift)
    drawPlayer(ctx, this.player, this.t)
    this.particles.draw(ctx)

    ctx.restore()

    // Мягкое затемнение/высветление в финале.
    if (this.finale > 0) {
      const fade = clamp((this.finale - 1.7) / (FINALE_DURATION - 1.7), 0, 0.9)
      if (fade > 0) {
        ctx.fillStyle = `rgba(253,250,247,${fade})`
        ctx.fillRect(0, 0, this.viewW, this.viewH)
      }
    }
  }
}
