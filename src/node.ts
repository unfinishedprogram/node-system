import Connection from "./connection";
import NodeSystem from "./node_system";
import Vec2 from "./vec2";
import Wikipedia from "./wikipedia";

declare global {
    interface Array<T> { remove(o: T): boolean; }
}

export default class Node {
    private lastPosition = new Vec2();
    private _tmp1 = new Vec2();
    private _tmp2 = new Vec2();
    private size = new Vec2(20, 20);

    public connections: Connection[] = [];
    public position = new Vec2();
    public locked = false;
    public readonly id: number;

    public readonly element = document.createElementNS('http://www.w3.org/2000/svg', 'image');

    constructor(private system: NodeSystem, public payload: string) {
        this.id = Math.random() * 0xFFFF;
        this.element.setAttribute("preserveAspectRatio", "none")
        this.element.setAttribute("style", "clip-path: circle(50% at 50% 50%)")

        this.element.setAttribute("width", `${this.size.x}`);
        this.element.setAttribute("height", `${this.size.y}`);

        Wikipedia.fetchPageImage(payload).then(img => this.element.setAttribute("href", img));
        Wikipedia.fetchPageUrl(payload).then(url => this.element.onclick = () => window.open(url, '_blank'));
    }

    public addConnection(connection: Connection) {
        this.connections.push(connection);
    }

    public removeConnection(connection: Connection) {
        this.connections.remove(connection);
    }

    public dispose() {
        this.connections.forEach(c => c.dispose());
    }

    public draw() {
        this.element.setAttribute("x", `${this.position.x - this.size.x / 2}`);
        this.element.setAttribute("y", `${this.position.y - this.size.y / 2}`);
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

    public addChild(payload: string): Node {
        let child = this.system.addNode(payload);
        child.setPosition(this.position.x, this.position.y);
        child.position.x += Math.random() - 0.5;
        child.position.y += Math.random() - 0.5;
        this.system.connect(this, child);
        return child;
    }
}
