import Connection from "./connection";
import HashGrid from "./hashGrid";
import Node from "./node";
import Vec2 from "./vec2";

export default class NodeSystem {
    public connections: Connection[] = [];
    public nodes: Node[] = [];

    private readonly hashGrid = new HashGrid<Node>(25, new Vec2(2000, 2000));
    private readonly tmp_vec = new Vec2();

    public readonly element = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    private lineElements = document.createElementNS("http://www.w3.org/2000/svg", "g");
    private nodeElements = document.createElementNS("http://www.w3.org/2000/svg", "g");
    private markElements = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    constructor() {
        this.element.append(this.lineElements, this.nodeElements, this.markElements);
        this.element.classList.add("node_system");
        this.element.setAttribute("viewBox", "650 650 700 700");
    }

    addMarker(marker: SVGMarkerElement) {
        this.markElements.append(marker);
    }

    addNode(payload: string): Node {
        let node = new Node(this, payload);
        this.nodeElements.append(node.element);
        this.markElements.append(node.marker);
        this.nodes.push(node);
        return node;
    }

    connect(a: Node, b: Node) {
        let connection = new Connection(this, a, b);
        a.addConnection(connection);
        b.addConnection(connection);
        this.connections.push(connection);
        this.lineElements.append(connection.element);
        return connection;
    }

    removeNode(node: Node) {
        this.markElements.querySelector(`#${node.id}`)?.remove();
        node.dispose();
        this.nodes.remove(node);
    }

    removeConnection(connection: Connection) {
        this.element.removeChild(connection.element);
        connection.dispose();
        this.connections.remove(connection);
    }

    draw() {
        for (let node of this.nodes) {
            node.draw();
        }

        for (let conn of this.connections) {
            conn.draw();
        }
    }

    randNode(): Node {
        return this.nodes[Math.floor(Math.random() * this.nodes.length)];
    }

    removeLongest() {
        this.connections.sort((a, b) => b.length - a.length);
        this.removeConnection(this.connections[0]);
    }

    applyNeighborRepulsion() {
        this.hashGrid.resetGrid();

        for (let node of this.nodes) {
            this.hashGrid.addItem(node);
        }

        for (let node of this.nodes) {
            for (let other of this.hashGrid.getAdj(node)) {
                if (other != node) {
                    this.doRepulsion(node, other);
                }
            }
        }
    }

    removeDisconnected() {
        this.nodes.filter(node =>
            node.connections.length == 0
        ).forEach(node => {
            this.removeNode(node);
        })
    }

    doRepulsion(a: Node, b: Node) {
        this.tmp_vec.copy(a.position).sub(b.position);
        let d = this.tmp_vec.magnitudeSq();
        if (d < 500) {
            this.tmp_vec.multiplyScalar(1 / d);
            b.position.sub(this.tmp_vec);
        }
    }

    stepConnections() {
        for (let conn of this.connections) {
            conn.step();
        }
    }

    stepNodes() {
        for (let node of this.nodes) {
            node.step();
        }
    }

    step() {
        this.applyNeighborRepulsion();
        this.stepConnections();
        this.stepNodes();
    }
}