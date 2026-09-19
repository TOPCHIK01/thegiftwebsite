// Камера с dead zone: персонаж свободно двигается внутри области
// экрана, камера начинает ехать только у её краёв.
export class Camera {
  constructor(levelWidth) {
    this.x = 0
    this.y = 0
    this.levelW = levelWidth
    this.viewW = 1280
    this.viewH = 720
  }

  setView(w, h) {
    this.viewW = w
    this.viewH = h
    this._clamp()
  }

  follow(target, dt) {
    // Dead zone: 36%–62% экрана по горизонтали.
    const dl = this.x + this.viewW * 0.36
    const dr = this.x + this.viewW * 0.62
    let tx = this.x
    if (target.x < dl) tx = target.x - this.viewW * 0.36
    else if (target.x + target.w > dr) tx = target.x + target.w - this.viewW * 0.62

    // Плавное догоняние.
    this.x += (tx - this.x) * Math.min(1, dt * 6)
    this._clamp()
  }

  snap(target) {
    this.x = target.x - this.viewW * 0.36
    this._clamp()
  }

  _clamp() {
    const maxX = Math.max(0, this.levelW - this.viewW)
    this.x = Math.max(0, Math.min(maxX, this.x))
  }
}
