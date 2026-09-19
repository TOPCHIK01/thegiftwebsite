import { MAX_PARTICLES } from './constants'

// Простая система частиц: пыль при приземлении, искры при сборе,
// конфетти при победе. Количество ограничено для телефонов.
export class Particles {
  constructor(reduceFx = false) {
    this.list = []
    this.reduceFx = reduceFx
  }

  _push(p) {
    if (this.list.length >= MAX_PARTICLES) this.list.shift()
    this.list.push(p)
  }

  _n(n) {
    return this.reduceFx ? Math.max(1, Math.round(n / 3)) : n
  }

  dust(x, y) {
    for (let i = 0; i < this._n(6); i++) {
      this._push({
        type: 'dust',
        x: x + (Math.random() - 0.5) * 30,
        y,
        vx: (Math.random() - 0.5) * 90,
        vy: -Math.random() * 70,
        life: 0.45,
        t: 0,
        size: 3 + Math.random() * 4,
      })
    }
  }

  sparkle(x, y, color = '#e8c795') {
    for (let i = 0; i < this._n(10); i++) {
      const a = (i / 10) * Math.PI * 2 + Math.random() * 0.5
      const sp = 60 + Math.random() * 110
      this._push({
        type: 'sparkle',
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 40,
        life: 0.7,
        t: 0,
        size: 2.5 + Math.random() * 3.5,
        color,
      })
    }
  }

  // Облачко пара/дыма — «фокусное» исчезновение врага.
  poof(x, y) {
    for (let i = 0; i < this._n(9); i++) {
      const a = (i / 9) * Math.PI * 2 + Math.random() * 0.6
      const sp = 30 + Math.random() * 70
      this._push({
        type: 'smoke',
        x,
        y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp * 0.5 - 30,
        life: 0.65,
        t: 0,
        size: 8 + Math.random() * 8,
      })
    }
  }

  hearts(x, y) {
    for (let i = 0; i < this._n(5); i++) {
      this._push({
        type: 'heart',
        x: x + (Math.random() - 0.5) * 24,
        y,
        vx: (Math.random() - 0.5) * 50,
        vy: -80 - Math.random() * 80,
        life: 0.9,
        t: 0,
        size: 7 + Math.random() * 5,
      })
    }
  }

  confetti(x, y) {
    const colors = ['#e5b8c4', '#cfa46f', '#d97a94', '#f2c9d6', '#e8c795', '#fff6ee']
    for (let i = 0; i < this._n(60); i++) {
      this._push({
        type: 'confetti',
        x: x + (Math.random() - 0.5) * 160,
        y: y - Math.random() * 60,
        vx: (Math.random() - 0.5) * 320,
        vy: -150 - Math.random() * 320,
        life: 1.8 + Math.random(),
        t: 0,
        size: 5 + Math.random() * 6,
        color: colors[i % colors.length],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 10,
      })
    }
  }

  update(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i]
      p.t += dt
      if (p.t >= p.life) {
        this.list.splice(i, 1)
        continue
      }
      p.x += p.vx * dt
      p.y += p.vy * dt
      if (p.type === 'confetti') {
        p.vy += 500 * dt
        p.rot += p.vr * dt
      } else if (p.type === 'dust') {
        p.vy += 300 * dt
      } else if (p.type === 'smoke') {
        // Дым замедляется и чуть всплывает.
        p.vx *= 1 - 2.5 * dt
        p.vy = p.vy * (1 - 2.5 * dt) - 30 * dt
      } else {
        p.vy += 120 * dt
      }
    }
  }

  draw(ctx) {
    for (const p of this.list) {
      const k = 1 - p.t / p.life
      ctx.globalAlpha = Math.max(0, k)
      if (p.type === 'confetti') {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        ctx.restore()
      } else if (p.type === 'heart') {
        ctx.fillStyle = '#d97a94'
        drawMiniHeart(ctx, p.x, p.y, p.size)
      } else if (p.type === 'smoke') {
        // Расширяющееся облачко, тающее с течением жизни.
        const r = p.size * (0.5 + (p.t / p.life) * 1.6)
        ctx.fillStyle = 'rgba(238,228,234,.8)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillStyle = p.type === 'dust' ? 'rgba(202,160,174,.8)' : p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * k, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.globalAlpha = 1
  }
}

export function drawMiniHeart(ctx, x, y, s) {
  ctx.beginPath()
  ctx.moveTo(x, y + s * 0.35)
  ctx.bezierCurveTo(x - s, y - s * 0.35, x - s * 0.5, y - s, x, y - s * 0.4)
  ctx.bezierCurveTo(x + s * 0.5, y - s, x + s, y - s * 0.35, x, y + s * 0.35)
  ctx.fill()
}
