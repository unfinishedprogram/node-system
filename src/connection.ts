import Node from "./node";
import NodeSystem from "./node_system";
function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
}
export default class Connection {
    constructor(private system: NodeSystem, public readonly a: Node<any>, public readonly b: Node<any>) { }

    dispose() {
        this.a?.removeConnection(this);
        this.b?.removeConnection(this);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.moveTo(this.a.position.x, this.a.position.y);
        ctx.lineTo(this.b.position.x, this.b.position.y);
    }

    get length() {
        return this.a.position.distSq(this.b.position);
    }

    step() {
        let nx = (this.a.position.x - this.b.position.x)
        let ny = (this.a.position.y - this.b.position.y)
        const d = nx * nx + ny * ny;

        let multiplier =
            Math.max(d - 90, 0) / 1000000;

        nx = clamp(nx * multiplier, -3, 3);
        ny = clamp(ny * multiplier, -3, 3);

        this.a.position.x -= nx;
        this.a.position.y -= ny;
        this.b.position.x += nx;
        this.b.position.y += ny;
    }
}