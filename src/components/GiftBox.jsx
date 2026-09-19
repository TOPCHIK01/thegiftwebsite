import { motion } from 'framer-motion'

const SPARKLES = [
  { top: '-4%', left: '10%', delay: '0s' },
  { top: '8%', left: '92%', delay: '1.1s' },
  { top: '55%', left: '-6%', delay: '2s' },
  { top: '70%', left: '98%', delay: '0.6s' },
  { top: '-10%', left: '58%', delay: '1.7s' },
  { top: '38%', left: '104%', delay: '2.6s' },
]

function Bow() {
  return (
    <svg className="gift-bow" viewBox="0 0 120 64" aria-hidden="true">
      <defs>
        <linearGradient id="bowGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eac78f" />
          <stop offset="55%" stopColor="#cfa46f" />
          <stop offset="100%" stopColor="#b5824a" />
        </linearGradient>
      </defs>
      <path
        d="M56 38 L38 62 L52 57 L58 44 Z"
        fill="url(#bowGold)"
        opacity="0.92"
      />
      <path
        d="M64 38 L82 62 L68 57 L62 44 Z"
        fill="url(#bowGold)"
        opacity="0.92"
      />
      <path
        d="M60 36 C36 4 12 8 12 26 C12 44 42 48 60 36 Z"
        fill="url(#bowGold)"
        stroke="#a8773f"
        strokeWidth="1.5"
      />
      <path
        d="M60 36 C84 4 108 8 108 26 C108 44 78 48 60 36 Z"
        fill="url(#bowGold)"
        stroke="#a8773f"
        strokeWidth="1.5"
      />
      <rect x="50" y="28" width="20" height="15" rx="6" fill="#b5824a" />
      <rect x="52" y="30" width="16" height="11" rx="5" fill="url(#bowGold)" />
    </svg>
  )
}

export default function GiftBox({ lidControls, mini = false }) {
  return (
    <div className={mini ? 'gift-box gift-box--mini' : 'gift-box'}>
      <div className="gift-aura" />
      <div className="gift-shadow" />
      <div className="gift-body">
        <div className="gift-ribbon" />
      </div>
      <motion.div
        className="gift-lid"
        animate={lidControls}
        style={{ transformOrigin: '16% 100%' }}
      >
        <div className="gift-lid-ribbon" />
        <Bow />
      </motion.div>
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="gift-sparkle"
          style={{ top: s.top, left: s.left, animationDelay: s.delay }}
        />
      ))}
    </div>
  )
}
