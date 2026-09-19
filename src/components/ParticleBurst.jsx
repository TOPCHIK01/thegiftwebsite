import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

const COUNT = 15
const BASE_DELAY = 0.45

// Детерминированные частицы: направления по «золотому углу»,
// чтобы вылет выглядел органично, но одинаково при каждом открытии.
export default function ParticleBurst() {
  const particles = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const angle = (i * 137.5 + 20) * (Math.PI / 180)
        const distance = 90 + (i % 5) * 34
        const type = i % 3 // 0 — блёстка, 1 — лепесток, 2 — сердечко
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance * 0.85 - 40,
          rotate: (i % 2 === 0 ? 1 : -1) * (60 + (i % 4) * 40),
          size: 7 + (i % 4) * 3,
          delay: BASE_DELAY + i * 0.045,
          type,
        }
      }),
    [],
  )

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/3 z-20"
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.5, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: [1, 1, 0],
            scale: [0.5, 1.1, 0.8],
            rotate: p.rotate,
          }}
          transition={{
            duration: 1.5,
            delay: p.delay,
            ease: [0.16, 0.84, 0.44, 1],
          }}
        >
          {p.type === 2 ? (
            <Heart
              width={p.size + 3}
              height={p.size + 3}
              className="fill-rose-deep text-rose-deep"
            />
          ) : p.type === 1 ? (
            <span
              className="block rounded-full bg-rose"
              style={{
                width: p.size,
                height: p.size * 0.55,
                boxShadow: '0 0 6px rgba(229,184,196,.7)',
              }}
            />
          ) : (
            <span
              className="block rounded-full"
              style={{
                width: p.size * 0.7,
                height: p.size * 0.7,
                background:
                  'radial-gradient(circle, #fff 0%, #e8c795 60%, transparent 80%)',
                boxShadow: '0 0 8px 2px rgba(232,199,149,.6)',
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}
