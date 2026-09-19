// Низкоуровневые помощники рисования на Canvas.

export function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

export function heartPath(ctx, x, y, s) {
  ctx.beginPath()
  ctx.moveTo(x, y + s * 0.9)
  ctx.bezierCurveTo(x - s * 1.1, y + s * 0.2, x - s * 0.85, y - s * 0.7, x, y - s * 0.1)
  ctx.bezierCurveTo(x + s * 0.85, y - s * 0.7, x + s * 1.1, y + s * 0.2, x, y + s * 0.9)
  ctx.closePath()
}

// Маленькая подарочная коробка в стиле сайта.
// lidLift: 0 = закрыта, >0 = крышка поднимается.
export function drawGift(ctx, x, y, w, h, lidLift = 0) {
  const rr = roundRect
  // тень
  ctx.fillStyle = 'rgba(125,48,68,.18)'
  ctx.beginPath()
  ctx.ellipse(x + w / 2, y + h + 4, w * 0.45, h * 0.08, 0, 0, Math.PI * 2)
  ctx.fill()

  // тело
  const bodyY = y + h * 0.34
  const bodyH = h * 0.66
  ctx.fillStyle = '#e5b8c4'
  rr(ctx, x + w * 0.08, bodyY, w * 0.84, bodyH, w * 0.08)
  ctx.fill()
  ctx.fillStyle = 'rgba(125,48,68,.12)'
  rr(ctx, x + w * 0.08, bodyY + bodyH * 0.7, w * 0.84, bodyH * 0.3, w * 0.06)
  ctx.fill()

  // лента на теле
  ctx.fillStyle = '#cfa46f'
  ctx.fillRect(x + w * 0.44, bodyY, w * 0.12, bodyH)

  // крышка (уезжает вверх при lidLift)
  const lidY = y + h * 0.18 - lidLift * h * 1.4
  const lidRot = -lidLift * 0.5
  ctx.save()
  ctx.translate(x + w / 2, lidY + h * 0.11)
  ctx.rotate(lidRot)
  ctx.translate(-w / 2, -h * 0.11)
  ctx.fillStyle = '#f0c9d3'
  rr(ctx, 0, 0, w, h * 0.22, w * 0.07)
  ctx.fill()
  ctx.fillStyle = '#cfa46f'
  ctx.fillRect(w * 0.44, 0, w * 0.12, h * 0.22)
  // бант
  ctx.fillStyle = '#cfa46f'
  ctx.beginPath()
  ctx.ellipse(w * 0.38, -h * 0.02, w * 0.12, h * 0.06, -0.5, 0, Math.PI * 2)
  ctx.ellipse(w * 0.62, -h * 0.02, w * 0.12, h * 0.06, 0.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#b5824a'
  ctx.beginPath()
  ctx.arc(w * 0.5, -h * 0.02, w * 0.045, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// Детерминированный псевдослучайный генератор для декораций.
export function seeded(i) {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return v - Math.floor(v)
}
