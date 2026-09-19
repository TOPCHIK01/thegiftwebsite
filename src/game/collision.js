// AABB-столкновения: rect = { x, y, w, h }.

export function aabb(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  )
}

// Двигает сущность по X и упирает в твёрдые платформы.
// Разрешает только боковые удары: если проникновение по Y меньше,
// чем по X — это посадка на край (особенно движущейся платформы),
// её разруливает moveY, а не «стена», откидывающая игрока назад.
// Возвращает true, если во что-то упёрся.
export function moveX(e, solids, dt) {
  e.x += e.vx * dt
  let hit = false
  for (const s of solids) {
    if (!aabb(e, s)) continue
    const ox = Math.min(e.x + e.w - s.x, s.x + s.w - e.x)
    const oy = Math.min(e.y + e.h - s.y, s.y + s.h - e.y)
    if (oy <= ox) continue
    if (e.x + e.w / 2 < s.x + s.w / 2) e.x = s.x - e.w
    else e.x = s.x + s.w
    e.vx = 0
    hit = true
  }
  return hit
}

// Двигает сущность по Y. Возвращает платформу, на которую встал (или null).
// Боковые проникновения пропускает — их уже разрулил moveX.
export function moveY(e, solids, dt) {
  e.y += e.vy * dt
  let ground = null
  for (const s of solids) {
    if (!aabb(e, s)) continue
    const ox = Math.min(e.x + e.w - s.x, s.x + s.w - e.x)
    const oy = Math.min(e.y + e.h - s.y, s.y + s.h - e.y)
    if (ox < oy) continue
    if (e.vy > 0) {
      e.y = s.y - e.h
      e.vy = 0
      ground = s
    } else if (e.vy < 0) {
      e.y = s.y + s.h
      e.vy = 0
    }
  }
  return ground
}

// Пересечение точки с прямоугольником (тап по подарку).
export function pointInRect(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h
}
