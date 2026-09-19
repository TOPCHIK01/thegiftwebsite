import { useEffect, useRef } from 'react'

// Праздничная палитра — мягкая, в тон сайту (без кислоты).
const COLORS = [
  '#e5b8c4',
  '#d97a94',
  '#f3d9de',
  '#cfa46f',
  '#e8c795',
  '#a9c8bb',
  '#a3b8d9',
  '#c9a9d9',
  '#f2b39d',
  '#ffffff',
]

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const rand = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[(Math.random() * arr.length) | 0]

// Свой roundRect — нативный ctx.roundRect отсутствует на iOS Safari < 16.
const rr = (ctx, x, y, w, h, r) => {
  const q = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + q, y)
  ctx.arcTo(x + w, y, x + w, y + h, q)
  ctx.arcTo(x + w, y + h, x, y + h, q)
  ctx.arcTo(x, y + h, x, y, q)
  ctx.arcTo(x, y, x + w, y, q)
  ctx.closePath()
}

// Бесконечный дождь из конфетти + мини-копий фото кота.
// Частицы перерабатываются (улетели вниз → появились сверху) —
// фиксированный пул, DOM не растёт, всё живёт в одном canvas.
export default function CatConfettiCanvas({ catUrl, reduceMotion = false }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let raf = null
    let w = 0
    let h = 0
    let elapsed = 0
    let last = performance.now()
    let imgReady = false

    const img = catUrl ? new Image() : null
    if (img) {
      img.onload = () => {
        imgReady = true
      }
      img.src = catUrl
    }

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Плотность под площадь экрана; reduceMotion режет популяцию.
    const area = w * h || 390 * 700
    let nConf = Math.round(clamp(area / 15000, 45, 110))
    let nCat = img ? Math.round(clamp(area / 42000, 12, 26)) : 0
    if (reduceMotion) {
      nConf = Math.round(nConf * 0.45)
      nCat = Math.round(nCat * 0.5)
    }
    const speedK = reduceMotion ? 0.55 : 1
    const rotK = reduceMotion ? 0.25 : 1
    const sizeK = w < 480 ? 0.8 : 1

    const spawnConfetti = (p, fromTop = true) => {
      p.z = rand(0.5, 1.15)
      p.w = rand(6, 11) * p.z
      p.h = rand(9, 16) * p.z
      p.x = rand(-20, w + 20)
      p.y = fromTop ? rand(-60, -10) : rand(-h * 0.4, -20)
      p.vy = rand(70, 160) * p.z * speedK
      p.vx = rand(-16, 16) * speedK
      p.rot = rand(0, Math.PI * 2)
      p.vr = rand(-3.5, 3.5) * rotK
      p.color = pick(COLORS)
      p.op = rand(0.65, 1)
      p.wob = rand(0, Math.PI * 2)
      p.wobAmp = rand(8, 20)
      return p
    }

    const catSize = () => {
      const r = Math.random()
      if (r < 0.35) return rand(20, 32)
      if (r < 0.75) return rand(30, 48)
      if (r < 0.95) return rand(45, 65)
      return rand(70, 92) // редкий крупный кот
    }

    const spawnCat = (p, fromTop = true) => {
      p.z = rand(0.6, 1.1)
      p.size = catSize() * sizeK * p.z
      p.shape = pick(['circle', 'round', 'card'])
      p.x = rand(-20, w + 20)
      p.y = fromTop ? rand(-100, -30) : rand(-160, -30)
      p.vy = rand(55, 130) * p.z * speedK
      p.vx = rand(-20, 20) * speedK
      p.rot = rand(-0.5, 0.5)
      p.vr = rand(-1.6, 1.6) * rotK
      p.wob = rand(0, Math.PI * 2)
      p.wobAmp = rand(10, 26)
      return p
    }

    // Поэтапный старт: конфетти разгоняются 0.2–1.1с, коты 0.8–2.2с.
    const confetti = []
    for (let i = 0; i < nConf; i++) {
      const p = spawnConfetti({}, false)
      p.delay = rand(0.2, 1.1)
      confetti.push(p)
    }
    const cats = []
    for (let i = 0; i < nCat; i++) {
      const p = spawnCat({}, false)
      p.delay = rand(0.8, 2.2)
      cats.push(p)
    }
    // Спящий пул для CAT RAIN BOOST.
    const boostCats = []
    const nBoost = Math.round(clamp(area / 60000, 5, 10))
    for (let i = 0; i < nBoost; i++) {
      const b = spawnCat({})
      b.delay = Infinity
      boostCats.push(b)
    }

    let nextBoost = rand(8, 15)
    let boostUntil = 0

    const step = (p, dt) => {
      p.y += p.vy * dt
      p.x += p.vx * dt + Math.sin(elapsed * 2 + p.wob) * p.wobAmp * dt
      p.rot += p.vr * dt
      if (p.x < -70) p.x = w + 70
      else if (p.x > w + 70) p.x = -70
    }

    const drawConfetti = (p) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = p.op
      ctx.fillStyle = p.color
      rr(ctx, -p.w / 2, -p.h / 2, p.w, p.h, Math.min(3, p.w * 0.35))
      ctx.fill()
      ctx.restore()
    }

    const drawCat = (p) => {
      const s = p.size
      const isCard = p.shape === 'card'
      const cw = s
      const ch = isCard ? s * 1.24 : s
      const rad = p.shape === 'circle' ? s / 2 : s * 0.28

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.shadowColor = 'rgba(125,48,68,.28)'
      ctx.shadowBlur = 8
      ctx.shadowOffsetY = 3
      ctx.fillStyle = '#fdfaf7'
      ctx.beginPath()
      if (p.shape === 'circle') ctx.arc(0, 0, rad, 0, Math.PI * 2)
      else rr(ctx, -cw / 2, -ch / 2, cw, ch, isCard ? s * 0.16 : rad)
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.shadowOffsetY = 0

      ctx.save()
      ctx.clip()
      if (imgReady) {
        const iw = img.naturalWidth
        const ih = img.naturalHeight
        const sc = Math.max(cw / iw, ch / ih)
        ctx.drawImage(img, (-iw * sc) / 2, (-ih * sc) / 2, iw * sc, ih * sc)
      } else {
        ctx.fillStyle = '#e5b8c4'
        ctx.fillRect(-cw / 2, -ch / 2, cw, ch)
      }
      ctx.restore()

      ctx.strokeStyle = 'rgba(255,255,255,.9)'
      ctx.lineWidth = Math.max(1.5, s * 0.05)
      ctx.beginPath()
      if (p.shape === 'circle') ctx.arc(0, 0, rad - ctx.lineWidth / 2, 0, Math.PI * 2)
      else rr(ctx, -cw / 2, -ch / 2, cw, ch, isCard ? s * 0.16 : rad)
      ctx.stroke()
      ctx.restore()
    }

    const frame = (ts) => {
      const dt = Math.min(0.05, (ts - last) / 1000)
      last = ts
      elapsed += dt
      ctx.clearRect(0, 0, w, h)

      // CAT RAIN BOOST: на 1–1.8с просыпается доп. пул котов.
      const boosting = elapsed < boostUntil
      if (!reduceMotion && elapsed >= nextBoost) {
        boostUntil = elapsed + rand(1.0, 1.8)
        nextBoost = elapsed + rand(8, 15)
        for (const b of boostCats) {
          spawnCat(b)
          b.delay = elapsed + rand(0, 0.35)
        }
      }

      for (const p of confetti) {
        if (elapsed < p.delay) continue
        step(p, dt)
        if (p.y - p.h > h + 40) spawnConfetti(p)
        drawConfetti(p)
      }
      for (const p of cats) {
        if (elapsed < p.delay) continue
        step(p, dt)
        if (p.y - p.size > h + 40) spawnCat(p)
        drawCat(p)
      }
      for (const b of boostCats) {
        if (elapsed < b.delay) continue
        step(b, dt)
        if (b.y - b.size > h + 40) {
          if (boosting) spawnCat(b)
          else b.delay = Infinity // спит до следующего буста
        }
        if (b.delay !== Infinity) drawCat(b)
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      if (img) img.onload = null
    }
  }, [catUrl, reduceMotion])

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
