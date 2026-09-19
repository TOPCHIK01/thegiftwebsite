import { PALETTE } from '../constants'
import { roundRect, heartPath, drawGift } from './draw'

const P = PALETTE

// Милый персонаж: круглое тельце, рюкзачок, щёчки.
// При неуязвимости — мигает, при приземлении — приседает.
export function drawPlayer(ctx, p, t) {
  if (p.invincible > 0 && Math.floor(t * 14) % 2 === 0) return

  const cx = p.x + p.w / 2
  const squashY = 1 - p.squash * 0.12
  const squashX = 1 + p.squash * 0.1
  const bob = p.grounded && Math.abs(p.vx) > 20 ? Math.abs(Math.sin(p.walkT)) * 2 : 0

  ctx.save()
  ctx.translate(cx, p.y + p.h)
  ctx.scale(squashX * p.face, squashY)
  ctx.translate(0, -p.h + bob)

  // тень
  ctx.fillStyle = 'rgba(125,48,68,.18)'
  ctx.beginPath()
  ctx.ellipse(0, p.h - bob + 2, p.w * 0.42, 6, 0, 0, Math.PI * 2)
  ctx.fill()

  // ножки — перебирают при ходьбе
  const step = Math.abs(p.vx) > 20 && p.grounded ? Math.sin(p.walkT) * 5 : 0
  ctx.fillStyle = P.playerEye
  ctx.beginPath()
  ctx.ellipse(-8 + step, p.h - 6, 6, 5, 0, 0, Math.PI * 2)
  ctx.ellipse(8 - step, p.h - 6, 6, 5, 0, 0, Math.PI * 2)
  ctx.fill()

  // тельце
  ctx.fillStyle = P.player
  roundRect(ctx, -p.w / 2, 0, p.w, p.h - 8, 18)
  ctx.fill()
  ctx.strokeStyle = 'rgba(125,48,68,.25)'
  ctx.lineWidth = 2
  ctx.stroke()

  // рюкзачок (сзади — слева при face=1)
  ctx.fillStyle = P.backpack
  roundRect(ctx, -p.w / 2 - 7, 12, 14, 24, 6)
  ctx.fill()
  ctx.fillStyle = P.backpackDark
  ctx.fillRect(-p.w / 2 - 7, 20, 14, 4)

  // лицо
  const eyeY = 20
  ctx.fillStyle = P.playerEye
  ctx.beginPath()
  ctx.arc(4, eyeY, 3, 0, Math.PI * 2)
  ctx.arc(14, eyeY, 3, 0, Math.PI * 2)
  ctx.fill()
  // блик в глазах
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(5, eyeY - 1, 1, 0, Math.PI * 2)
  ctx.arc(15, eyeY - 1, 1, 0, Math.PI * 2)
  ctx.fill()
  // щёчки
  ctx.fillStyle = P.playerCheek
  ctx.globalAlpha = 0.65
  ctx.beginPath()
  ctx.arc(0, eyeY + 7, 4, 0, Math.PI * 2)
  ctx.arc(19, eyeY + 7, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1
  // улыбка
  ctx.strokeStyle = P.playerEye
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.arc(9, eyeY + 6, 4, 0.3, Math.PI - 0.3)
  ctx.stroke()

  ctx.restore()
}

// Маленькое пушистое существо, ходит туда-сюда.
export function drawEnemy(ctx, e, t) {
  const wob = Math.sin(t * 8 + e.x * 0.05) * 2
  const cx = e.x + e.w / 2

  // ножки
  const step = Math.sin(t * 10) * 4
  ctx.fillStyle = P.enemyDark
  ctx.beginPath()
  ctx.ellipse(cx - 8 + step * e.dir, e.y + e.h - 3, 5, 4, 0, 0, Math.PI * 2)
  ctx.ellipse(cx + 8 - step * e.dir, e.y + e.h - 3, 5, 4, 0, 0, Math.PI * 2)
  ctx.fill()

  // тело-пушинка
  ctx.fillStyle = P.enemy
  ctx.beginPath()
  ctx.arc(cx, e.y + e.h / 2 + wob, e.w / 2, 0, Math.PI * 2)
  ctx.fill()
  // пушистость
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.4
    ctx.beginPath()
    ctx.arc(
      cx + Math.cos(a) * (e.w / 2 - 3),
      e.y + e.h / 2 + wob + Math.sin(a) * (e.w / 2 - 3),
      e.w / 6,
      0,
      Math.PI * 2,
    )
    ctx.fill()
  }

  // глазки + бровки (слегка сердитый, но милый)
  const eyeY = e.y + e.h / 2 - 4 + wob
  ctx.fillStyle = P.playerEye
  ctx.beginPath()
  ctx.arc(cx - 6 + e.dir * 3, eyeY, 2.6, 0, Math.PI * 2)
  ctx.arc(cx + 6 + e.dir * 3, eyeY, 2.6, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = P.playerEye
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.moveTo(cx - 10 + e.dir * 3, eyeY - 7)
  ctx.lineTo(cx - 3 + e.dir * 3, eyeY - 5)
  ctx.moveTo(cx + 10 + e.dir * 3, eyeY - 7)
  ctx.lineTo(cx + 3 + e.dir * 3, eyeY - 5)
  ctx.stroke()
}

// Коллекционные предметы: сердечки и подарочки, покачиваются.
export function drawCollectible(ctx, c, t) {
  const bob = Math.sin(t * 3 + c.x * 0.02) * 5
  const cx = c.x
  const cy = c.y + bob

  if (c.type === 'heart') {
    // свечение
    ctx.fillStyle = 'rgba(217,122,148,.2)'
    ctx.beginPath()
    ctx.arc(cx, cy, 22, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = P.heart
    heartPath(ctx, cx, cy - 6, 15)
    ctx.fill()
    // блик
    ctx.fillStyle = 'rgba(255,255,255,.6)'
    ctx.beginPath()
    ctx.arc(cx - 5, cy - 8, 3, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // свечение
    ctx.fillStyle = 'rgba(232,199,149,.3)'
    ctx.beginPath()
    ctx.arc(cx, cy, 24, 0, Math.PI * 2)
    ctx.fill()

    drawGift(ctx, cx - 17, cy - 18, 34, 36, 0)
  }
}

// Финальный большой подарок + подсказка-стрелка.
// lidLift 0..1 — прогресс открытия в финальной сцене.
export function drawGoal(ctx, goal, t, near, lidLift) {
  const w = 150
  const h = 165
  const x = goal.x - w / 2
  const y = goal.y - h

  // пульсирующее свечение
  const pulse = 0.5 + Math.sin(t * 3) * 0.25 + lidLift
  const glow = ctx.createRadialGradient(
    goal.x,
    y + h * 0.4,
    0,
    goal.x,
    y + h * 0.4,
    140 + lidLift * 120,
  )
  glow.addColorStop(0, `rgba(232,199,149,${0.45 * pulse})`)
  glow.addColorStop(1, 'rgba(232,199,149,0)')
  ctx.fillStyle = glow
  ctx.fillRect(goal.x - 280, y - 140, 560, h + 280)

  drawGift(ctx, x, y, w, h, lidLift)

  // стрелка-подсказка, когда игрок рядом
  if (near && lidLift === 0) {
    const ay = y - 34 - Math.abs(Math.sin(t * 4)) * 10
    ctx.fillStyle = '#7d3044'
    ctx.beginPath()
    ctx.moveTo(goal.x - 12, ay - 14)
    ctx.lineTo(goal.x + 12, ay - 14)
    ctx.lineTo(goal.x, ay)
    ctx.closePath()
    ctx.fill()
  }
}
