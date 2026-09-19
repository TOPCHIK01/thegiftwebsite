import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

// Кнопка музыки в углу. Без аудиофайла в src/assets/music/ —
// показывается неактивной и ничего не ломает.
export default function MusicToggle({ hasTrack, playing, onToggle }) {
  const label = hasTrack
    ? playing
      ? 'Выключить музыку'
      : 'Включить музыку'
    : 'Музыка пока не добавлена'

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.9, duration: 0.4 }}
      onClick={hasTrack ? onToggle : undefined}
      aria-label={label}
      aria-pressed={hasTrack ? playing : undefined}
      aria-disabled={!hasTrack}
      title={hasTrack ? label : 'Положи mp3 в src/assets/music — и она заработает'}
      style={{
        top: 'max(1rem, env(safe-area-inset-top))',
        right: 'max(1rem, env(safe-area-inset-right))',
      }}
      className={`fixed z-40 grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-white/60 text-bordeaux shadow-lg shadow-bordeaux/10 backdrop-blur-md transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        hasTrack
          ? 'cursor-pointer hover:bg-white/80'
          : 'cursor-not-allowed opacity-55'
      }`}
    >
      {hasTrack && playing ? <Volume2 size={19} /> : <VolumeX size={19} />}
    </motion.button>
  )
}
