import { Heart, Gift, Pause, Volume2, VolumeX } from 'lucide-react'
import { START_LIVES } from '../../game/constants'
import { game } from '../../data/content'

// Компактный HUD: жизни, счётчики, пауза и звук.
export default function GameHUD({ hud, muted, onPause, onToggleMute }) {
  return (
    <div
      className="pointer-events-none absolute top-0 right-0 left-0 z-20 flex items-start justify-between gap-2"
      style={{
        paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left))',
        paddingRight: 'max(0.75rem, env(safe-area-inset-right))',
      }}
    >
      <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/60 bg-white/55 px-3 py-1.5 shadow-md shadow-bordeaux/10 backdrop-blur-md">
        {Array.from({ length: START_LIVES }, (_, i) => (
          <Heart
            key={i}
            size={17}
            className={
              i < hud.lives
                ? 'fill-rose-deep text-rose-deep'
                : 'text-rose-deep/30'
            }
          />
        ))}
      </div>

      <div className="pointer-events-auto flex items-center gap-1.5">
        <div className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/55 px-3 py-1.5 text-sm font-semibold text-bordeaux shadow-md shadow-bordeaux/10 backdrop-blur-md">
          <Heart size={15} className="fill-rose-deep text-rose-deep" />
          {hud.hearts}/{hud.totalHearts}
          <Gift size={15} className="ml-1.5 text-gold" />
          {hud.gifts}/{hud.totalGifts}
        </div>

        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? 'Включить звук' : 'Выключить звук'}
          className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/60 bg-white/55 text-bordeaux shadow-md shadow-bordeaux/10 backdrop-blur-md transition hover:bg-white/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <button
          type="button"
          onClick={onPause}
          aria-label={game.pause}
          className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/60 bg-white/55 text-bordeaux shadow-md shadow-bordeaux/10 backdrop-blur-md transition hover:bg-white/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <Pause size={18} />
        </button>
      </div>
    </div>
  )
}
