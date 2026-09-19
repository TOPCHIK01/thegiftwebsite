import { PALETTE } from '../constants'
import { seeded } from './draw'

const P = PALETTE

// Параллакс-фон: небо → облака → холмы → домики и деревья вдалеке.
// Каждый слой сдвигается на camera.x * свой коэффициент.
export function drawBackground(ctx, camera, viewW, viewH, t) {
  // Небо
  const sky = ctx.createLinearGradient(0, 0, 0, viewH)
  sky.addColorStop(0, P.skyTop)
  sky.addColorStop(0.55, P.skyMid)
  sky.addColorStop(1, P.skyBottom)
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, viewW, viewH)

  // Солнце — мягкое свечение
  const sunX = viewW * 0.78
  const sunY = viewH * 0.16
  const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 180)
  glow.addColorStop(0, 'rgba(255,248,232,.9)')
  glow.addColorStop(1, 'rgba(255,248,232,0)')
  ctx.fillStyle = glow
  ctx.fillRect(sunX - 180, sunY - 180, 360, 360)

  // Облака (слой 0.15) — дрейфуют + параллакс
  const cloudOff = camera.x * 0.15 - t * 6
  ctx.fillStyle = P.cloud
  for (let i = 0; i < 8; i++) {
    const cx = mod(i * 480 + seeded(i) * 200 - cloudOff, viewW + 320) - 160
    const cy = 50 + seeded(i + 40) * 150
    const s = 0.7 + seeded(i + 80) * 0.7
    cloud(ctx, cx, cy, s)
  }

  // Далёкие холмы (0.3)
  drawHills(ctx, camera.x * 0.3, viewW, viewH, P.hillFar, 150, 60)

  // Ближние холмы + домики и деревья (0.55)
  drawHills(ctx, camera.x * 0.55, viewW, viewH, P.hillNear, 90, 110)
  const midOff = camera.x * 0.55
  for (let i = 0; i < 14; i++) {
    const wx = i * 620 + seeded(i + 7) * 300
    const sx = wx - midOff
    if (sx < -140 || sx > viewW + 140) continue
    const base = viewH - 96
    if (i % 4 === 1) drawHouse(ctx, sx, base, 0.8 + seeded(i) * 0.4)
    else drawTree(ctx, sx, base, 0.8 + seeded(i) * 0.6)
  }
}

function mod(a, n) {
  return ((a % n) + n) % n
}

function cloud(ctx, x, y, s) {
  ctx.beginPath()
  ctx.arc(x, y, 26 * s, 0, Math.PI * 2)
  ctx.arc(x + 28 * s, y - 10 * s, 30 * s, 0, Math.PI * 2)
  ctx.arc(x + 58 * s, y, 24 * s, 0, Math.PI * 2)
  ctx.arc(x + 30 * s, y + 8 * s, 26 * s, 0, Math.PI * 2)
  ctx.fill()
}

// Волнистые холмы синусоидой.
function drawHills(ctx, offset, viewW, viewH, color, base, amp) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(0, viewH)
  for (let x = 0; x <= viewW; x += 20) {
    const wx = x + offset
    const y =
      viewH -
      base -
      Math.abs(Math.sin(wx * 0.0016) * amp) -
      Math.sin(wx * 0.004) * amp * 0.25
    ctx.lineTo(x, y)
  }
  ctx.lineTo(viewW, viewH)
  ctx.closePath()
  ctx.fill()
}

function drawTree(ctx, x, baseY, s) {
  ctx.fillStyle = P.treeTrunk
  ctx.fillRect(x - 4 * s, baseY - 40 * s, 8 * s, 40 * s)
  ctx.fillStyle = P.treeCrown
  ctx.beginPath()
  ctx.arc(x, baseY - 58 * s, 26 * s, 0, Math.PI * 2)
  ctx.arc(x - 18 * s, baseY - 44 * s, 18 * s, 0, Math.PI * 2)
  ctx.arc(x + 18 * s, baseY - 44 * s, 18 * s, 0, Math.PI * 2)
  ctx.fill()
}

function drawHouse(ctx, x, baseY, s) {
  ctx.fillStyle = '#f3e3da'
  ctx.fillRect(x - 30 * s, baseY - 42 * s, 60 * s, 42 * s)
  ctx.fillStyle = '#c98d9e'
  ctx.beginPath()
  ctx.moveTo(x - 38 * s, baseY - 42 * s)
  ctx.lineTo(x, baseY - 68 * s)
  ctx.lineTo(x + 38 * s, baseY - 42 * s)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#a9748a'
  ctx.fillRect(x - 8 * s, baseY - 24 * s, 16 * s, 24 * s)
}
