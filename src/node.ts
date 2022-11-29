import Connection from "./connection";
import NodeSystem from "./node_system";
import Vec2 from "./vec2";

declare global {
    interface Array<T> { remove(o: T): boolean; }
}

export default class Node<T> {
    private lastPosition = new Vec2();
    private _tmp1 = new Vec2();
    private _tmp2 = new Vec2();

    public connections: Connection[] = [];
    public position = new Vec2();
    public locked = false;
    public readonly id: number;

    constructor(private system: NodeSystem, public payload: T) { this.id = Math.random() * 0xFFFF }
    public addConnection(connection: Connection) {
        this.connections.push(connection);
    }

    public removeConnection(connection: Connection) {
        this.connections.remove(connection);
    }

    public dispose() {
        this.connections.forEach(c => c.dispose());
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.moveTo(this.position.x - 2, this.position.y);
        ctx.arc(this.position.x, this.position.y, 2, 0, 360);
    }

    public setPosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
        this.lastPosition.copy(this.position);
    }

    public step() {
        if (this.locked) {
            this.position.copy(this.lastPosition);
            return;
        }

        this._tmp1.copy(this.position);
        this._tmp2.copy(this.position).sub(this.lastPosition);
        this.position.add(this._tmp2.multiplyScalar(0.998));
        this.lastPosition.copy(this._tmp1);
    }

    public addChild<T>(payload: T): Node<T> {
        let child = this.system.addNode(payload);
        child.setPosition(this.position.x, this.position.y);
        child.position.x += Math.random() - 0.5;
        child.position.y += Math.random() - 0.5;
        this.system.connect(this, child);
        return child;
    }
}
