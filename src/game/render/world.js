import { PALETTE } from '../constants'
import { roundRect, seeded, heartPath } from './draw'

const P = PALETTE

// Твёрдый мир: платформы, шипы, чекпоинты, декор на земле.
export function drawWorld(ctx, level, camera, viewW, viewH, t) {
  const camL = camera.x - 80
  const camR = camera.x + viewW + 80

  for (const p of level.platforms) {
    if (p.x + p.w < camL || p.x > camR) continue
    if (p.type === 'ground') drawGround(ctx, p)
    else drawSlab(ctx, p)
  }

  // Декор: цветы и травка на земле (детерминированно по координатам).
  for (const p of level.platforms) {
    if (p.type !== 'ground') continue
    if (p.x + p.w < camL || p.x > camR) continue
    drawGroundDecor(ctx, p, t)
  }

  for (const h of level.hazards) {
    if (h.x + h.w < camL || h.x > camR) continue
    drawSpikes(ctx, h)
  }

  for (const c of level.checkpoints) {
    if (c.x < camL || c.x > camR) continue
    drawCheckpoint(ctx, c, t)
  }
}

function drawGround(ctx, p) {
  // Тело земли
  ctx.fillStyle = P.ground
  ctx.fillRect(p.x, p.y, p.w, p.h)
  ctx.fillStyle = P.groundDark
  ctx.fillRect(p.x, p.y + p.h * 0.55, p.w, p.h * 0.45)

  // Травяной верх
  ctx.fillStyle = P.grass
  roundRect(ctx, p.x - 2, p.y - 10, p.w + 4, 22, 10)
  ctx.fill()
  ctx.fillStyle = P.grassDark
  roundRect(ctx, p.x - 2, p.y + 4, p.w + 4, 8, 4)
  ctx.fill()
}

function drawSlab(ctx, p) {
  // Тень под плитой
  ctx.fillStyle = 'rgba(125,48,68,.14)'
  roundRect(ctx, p.x + 4, p.y + 8, p.w, p.h, p.h / 2)
  ctx.fill()

  ctx.fillStyle = P.slab
  roundRect(ctx, p.x, p.y, p.w, p.h, p.h / 2)
  ctx.fill()
  ctx.fillStyle = P.slabEdge
  roundRect(ctx, p.x, p.y + p.h * 0.6, p.w, p.h * 0.4, p.h / 2)
  ctx.fill()
  // блик
  ctx.fillStyle = 'rgba(255,255,255,.5)'
  roundRect(ctx, p.x + 6, p.y + 3, p.w - 12, p.h * 0.3, p.h * 0.15)
  ctx.fill()
}

function drawGroundDecor(ctx, p, t) {
  const step = 90
  for (let x = p.x + 30; x < p.x + p.w - 30; x += step) {
    const r = seeded(x)
    if (r < 0.45) {
      // цветок
      const sway = Math.sin(t * 2 + x) * 2
      ctx.strokeStyle = '#8fae8a'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, p.y - 10)
      ctx.quadraticCurveTo(x + sway, p.y - 22, x + sway * 1.5, p.y - 30)
      ctx.stroke()
      ctx.fillStyle = r < 0.2 ? '#d97a94' : '#f2c9d6'
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2
        ctx.beginPath()
        ctx.arc(
          x + sway * 1.5 + Math.cos(a) * 4.5,
          p.y - 30 + Math.sin(a) * 4.5,
          3.2,
          0,
          Math.PI * 2,
        )
        ctx.fill()
      }
      ctx.fillStyle = '#e8c795'
      ctx.beginPath()
      ctx.arc(x + sway * 1.5, p.y - 30, 3, 0, Math.PI * 2)
      ctx.fill()
    } else if (r < 0.75) {
      // травка
      ctx.strokeStyle = '#9fb896'
      ctx.lineWidth = 2
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath()
        ctx.moveTo(x + i * 5, p.y - 8)
        ctx.quadraticCurveTo(
          x + i * 6 + Math.sin(t * 2 + x + i) * 2,
          p.y - 20,
          x + i * 8,
          p.y - 24,
        )
        ctx.stroke()
      }
    }
  }
}

function drawSpikes(ctx, h) {
  // Мягкие на вид, но понятные как опасность.
  ctx.fillStyle = P.spikeBase
  roundRect(ctx, h.x - 3, h.y + h.h - 8, h.w + 6, 10, 4)
  ctx.fill()

  const n = Math.max(2, Math.round(h.w / 22))
  const sw = h.w / n
  ctx.fillStyle = P.spike
  for (let i = 0; i < n; i++) {
    const sx = h.x + i * sw
    ctx.beginPath()
    ctx.moveTo(sx, h.y + h.h)
    ctx.lineTo(sx + sw / 2, h.y)
    ctx.lineTo(sx + sw, h.y + h.h)
    ctx.closePath()
    ctx.fill()
  }
}

// Флажок-чекпоинт с сердечком; взвивается при активации.
function drawCheckpoint(ctx, c, t) {
  const x = c.x
  const base = c.y
  const wave = c.activated ? Math.sin(t * 8) * 4 : Math.sin(t * 2) * 1.5

  // флажок
  ctx.fillStyle = c.activated ? P.flag : '#b59aa5'
  ctx.fillRect(x - 2, base - 92, 4, 92)

  const flagColor = c.activated ? '#d97a94' : '#d9c3cb'
  ctx.fillStyle = flagColor
  ctx.beginPath()
  ctx.moveTo(x + 2, base - 90)
  ctx.quadraticCurveTo(x + 26 + wave, base - 82, x + 46, base - 76 + wave)
  ctx.lineTo(x + 2, base - 62)
  ctx.closePath()
  ctx.fill()

  // сердечко на флажке
  if (c.activated) {
    ctx.fillStyle = '#fff6ee'
    heartPath(ctx, x + 18, base - 82, 9)
    ctx.fill()
  }

  // шарик на верхушке
  ctx.fillStyle = c.activated ? '#e8c795' : '#c9b2bc'
  ctx.beginPath()
  ctx.arc(x, base - 94, 5, 0, Math.PI * 2)
  ctx.fill()
}
