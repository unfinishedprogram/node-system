export default class Vec2 {
    static _tmp = new Vec2();

    constructor(
        public x: number = 0,
        public y: number = 0
    ) { };

    reset() {
        this.x = 0;
        this.y = 0;
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    add(other: Vec2) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    copy(other: Vec2) {
        this.x = other.x;
        this.y = other.y;
        return this;
    }

    sub(other: Vec2) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    distSq(other: Vec2) {
        let res = Vec2._tmp.copy(this).sub(other).magnitudeSq();
        Vec2._tmp.reset()
        return res;
    }

    magnitudeSq() {
        return this.x * this.x + this.y * this.y;
    }

    multiplyScalar(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    dist(other: Vec2) {
        return this.distSq(other) ** 0.5;
    }

    clamp(min: number, max: number) {
        this.x = Math.min(Math.max(this.x, min), max);
        this.y = Math.min(Math.max(this.y, min), max);
        return this;
    }
}