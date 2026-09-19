import { motion } from 'framer-motion'

const BOKEH = [
  { size: 180, top: '12%', left: '8%', delay: '0s', opacity: 0.35 },
  { size: 130, top: '64%', left: '82%', delay: '2.5s', opacity: 0.3 },
  { size: 220, top: '78%', left: '10%', delay: '1.2s', opacity: 0.25 },
  { size: 100, top: '30%', left: '76%', delay: '3.8s', opacity: 0.35 },
  { size: 150, top: '45%', left: '40%', delay: '5s', opacity: 0.2 },
  { size: 90, top: '85%', left: '60%', delay: '1.8s', opacity: 0.3 },
]

// Фон всего сайта: молочно-белый до открытия,
// плавно переходит в нежно-розовый после клика по коробке.
export default function BackgroundEffects({ opened }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, #fffdfb 0%, #fdfaf7 55%, #f7efe8 100%)',
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 28%, #fbeef2 0%, #f3d9de 50%, #ecc7d1 100%)',
        }}
        initial={false}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      />
      {BOKEH.map((b, i) => (
        <div
          key={i}
          className="bokeh"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            opacity: b.opacity,
            animationDelay: b.delay,
            background:
              'radial-gradient(circle, rgba(229,184,196,.5), transparent 70%)',
          }}
        />
      ))}
    </div>
  )
}
