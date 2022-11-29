import Connection from "./connection";
import HashGrid from "./hashGrid";
import Node from "./node";
import Vec2 from "./vec2";

export default class NodeSystem {
    public connections: Connection[] = [];
    public nodes: Node<any>[] = [];

    private readonly hashGrid = new HashGrid<Node<any>>(25, new Vec2(2000, 2000));
    private readonly tmp_vec = new Vec2();


    addNode<T>(payload: T): Node<T> {
        let node = new Node(this, payload);
        this.nodes.push(node);
        return node;
    }

    connect(a: Node<any>, b: Node<any>) {
        let connection = new Connection(this, a, b);
        a.addConnection(connection);
        b.addConnection(connection);
        this.connections.push(connection);
        return connection;
    }

    removeNode(node: Node<any>) {
        node.dispose();
        this.nodes.remove(node);
    }

    removeConnection(connection: Connection) {
        connection.dispose();
        this.connections.remove(connection);
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (let node of this.nodes) {
            node.draw(ctx);
        }

        for (let conn of this.connections) {
            conn.draw(ctx);
        }
    }

    randNode(): Node<any> {
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

    doRepulsion(a: Node<any>, b: Node<any>) {
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
        this.stepConnections();
        this.stepNodes();
        this.applyNeighborRepulsion();
    }
}