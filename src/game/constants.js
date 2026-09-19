// Логическая система координат игры.
// Физика и уровень живут в этих единицах, canvas просто масштабируется.
export const VIEW_H = 720
export const VIEW_MIN_W = 960
export const VIEW_MAX_W = 1600

export const GRAVITY = 2400
export const MAX_FALL = 1400
export const MOVE_ACCEL = 2600
export const MOVE_MAX = 380
export const FRICTION = 2400
export const JUMP_VEL = 900
export const COYOTE_TIME = 0.1
export const JUMP_BUFFER = 0.12

export const START_LIVES = 3
export const INVINCIBLE_TIME = 1.6
export const KNOCKBACK_X = 380
export const KNOCKBACK_Y = 540

export const MAX_PARTICLES = 140

export const FINALE_DURATION = 2.6

// Палитра игры — та же, что у сайта.
export const PALETTE = {
  skyTop: '#fdeef3',
  skyMid: '#f6dbe3',
  skyBottom: '#eec3d0',
  cloud: 'rgba(255,255,255,.85)',
  hillFar: '#e8c7d2',
  hillNear: '#dfb0c0',
  treeTrunk: '#a9748a',
  treeCrown: '#e5a9bc',
  treeCrownLight: '#f2c9d6',
  ground: '#caa0ae',
  groundDark: '#b58a9a',
  grass: '#f2d3dc',
  grassDark: '#e3b3c2',
  slab: '#f6e3e9',
  slabEdge: '#e3b3c2',
  spike: '#9c4258',
  spikeBase: '#7d3044',
  player: '#fff6ee',
  playerCheek: '#f0a8bc',
  playerEye: '#4a3540',
  backpack: '#cfa46f',
  backpackDark: '#a8773f',
  heart: '#d97a94',
  heartDark: '#b8536e',
  giftBox: '#e5b8c4',
  giftRibbon: '#cfa46f',
  enemy: '#c9b6d4',
  enemyDark: '#9d84ad',
  flag: '#7d3044',
  gold: '#e8c795',
}
