import { ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react'

// Большие полупрозрачные кнопки управления для телефона.
// Удержание работает через pointerdown/pointerup/pointercancel/pointerleave.
function ControlButton({ label, onDown, onUp, children, className = '' }) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(e) => {
        e.preventDefault()
        e.currentTarget.setPointerCapture?.(e.pointerId)
        onDown()
      }}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={onUp}
      onContextMenu={(e) => e.preventDefault()}
      className={`grid h-16 w-16 cursor-pointer place-items-center rounded-full border border-white/60 bg-white/40 text-bordeaux shadow-lg shadow-bordeaux/15 backdrop-blur-md transition select-none active:scale-90 active:bg-white/60 sm:h-[72px] sm:w-[72px] ${className}`}
      style={{ touchAction: 'none' }}
    >
      {children}
    </button>
  )
}

export default function TouchControls({ input }) {
  return (
    <div
      className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 flex items-end justify-between"
      style={{
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
        paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))',
        paddingTop: '1rem',
      }}
    >
      <div className="pointer-events-auto flex gap-3">
        <ControlButton
          label="Влево"
          onDown={() => input.setLeft(true)}
          onUp={() => input.setLeft(false)}
        >
          <ChevronLeft size={34} />
        </ControlButton>
        <ControlButton
          label="Вправо"
          onDown={() => input.setRight(true)}
          onUp={() => input.setRight(false)}
        >
          <ChevronRight size={34} />
        </ControlButton>
      </div>

      <div className="pointer-events-auto">
        <ControlButton
          label="Прыжок"
          onDown={() => input.pressJump()}
          onUp={() => input.releaseJump()}
          className="h-20 w-20 sm:h-24 sm:w-24"
        >
          <ArrowUp size={38} />
        </ControlButton>
      </div>
    </div>
  )
}
