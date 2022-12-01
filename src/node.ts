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
    public size = new Vec2(20, 20);
    public dragging = false;

    public connections: Connection[] = [];
    public position = new Vec2();
    public locked = false;
    public readonly id: number;

    public marker: SVGMarkerElement;
    public element: SVGLineElement;


    constructor(private system: NodeSystem, public payload: string) {
        this.id = Math.random() * 0xFFFF;

        this.marker = this.makeMarker();
        this.element = this.makeElement();
        this.setupMouseEvents();
    }

    private makeElement() {
        let element = document.createElementNS("http://www.w3.org/2000/svg", "line");
        element.setAttribute("marker-start", `url(#${this.id})`);
        element.setAttribute("stroke-linecap", "round");
        element.setAttribute("stroke-width", "20");
        return element;
    }

    private makeMarker(): SVGMarkerElement {
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.appendChild(this.makeImage());
        marker.id = this.id.toString();
        marker.setAttribute("viewBox", "-10 -10 20 20")
        marker.setAttribute("markerUnits", "userSpaceOnUse");
        marker.setAttribute("markerWidth", this.size.x.toString());
        marker.setAttribute("markerHeight", this.size.y.toString());
        return marker;
    }

    private makeImage(): SVGImageElement {
        let image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute("preserveAspectRatio", "none");
        image.setAttribute("style", "clip-path: circle(50% at 50% 50%)")
        image.setAttribute("width", `${this.size.x}`);
        image.setAttribute("height", `${this.size.y}`);
        image.setAttribute("x", "-10");
        image.setAttribute("y", "-10");

        Wikipedia.fetchPageImage(this.payload).then(img => {
            image.setAttribute("href", img);
        });

        return image;
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

        this.element.setAttribute("x1", `${this.position.x}`);
        this.element.setAttribute("y1", `${this.position.y}`);
        this.element.setAttribute("x2", `${this.position.x}`);
        this.element.setAttribute("y2", `${this.position.y}`);
    }

    public setPosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
        this.lastPosition.copy(this.position);
    }

    public step() {
        if (this.locked || this.dragging) {
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

    private startDrag = () => {
        document.addEventListener("mousemove", this.drag);
        document.addEventListener("mouseup", this.endDrag);
        document.addEventListener("mouseleave", this.endDrag);
        this.dragging = true;
    }

    private drag = (event: MouseEvent) => {
        this.position.x += event.movementX;
        this.position.y += event.movementY;
        this.lastPosition.copy(this.position);
    }

    private endDrag = () => {
        document.removeEventListener("mousemove", this.drag);
        document.removeEventListener("mouseup", this.endDrag);
        document.removeEventListener("mouseleave", this.endDrag);
        this.dragging = false;
    }

    private setupMouseEvents() {
        Wikipedia.fetchPageUrl(payload).then(url => this.element.onclick = () => window.open(url, '_blank'));
        this.element.addEventListener("mousedown", this.startDrag);
    }
}
