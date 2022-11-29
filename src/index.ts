import NodeSystem from "./node_system";
export { }

declare global {
    interface Array<T> {
        remove(o: T): boolean;
    }
}

Array.prototype["remove"] = function (item) {
    const index = this.indexOf(item);
    if (index > -1) {
        this.splice(index, 1);
        return true;
    }
    return false;
}

const c = document.querySelector("#canvas") as HTMLCanvasElement;
const ctx = c.getContext("2d")!;

let system = new NodeSystem();

c.width = 2000;
c.height = 2000;

ctx.strokeStyle = "white";

const center = system.addNode(0);
center.locked = true;
center.setPosition(1000, 1000);

const step = () => {
    ctx.clearRect(0, 0, 2000, 2000)
    ctx.beginPath();
    system.draw(ctx);
    system.step();
    ctx.stroke();
    // requestAnimationFrame(step);
}

const appendNode = () => {
    let r = system.randNode();
    r.addChild(0);
}

let deltaT = 0;

let deltas = [0, 0, 0, 0];

const bench = () => {
    let t = performance.now();
    step();

    if (Math.random() > 0.98) appendNode()

    system.step();

    deltaT = performance.now() - t;
    deltas.splice(0, 1);
    deltas.push(deltaT);

    if (system.nodes.length % 100 == 0) {
        console.log(system.nodes.length / deltaT, system.nodes.length, deltaT);
    }


    requestAnimationFrame(bench);

    // if (Math.min(Math.min(Math.min(deltas[0], deltas[1], deltas[2], deltas[3]))) < 16) {
    // } else {
    // console.log("DONE:", system.nodes.length)
    // }
}


// setInterval(() => appendNode(), 100)
let t = performance.now();

// for (let i = 0; i < 30; i++) {
//     bench();
// }

deltaT = performance.now() - t;
console.log("Time", deltaT);

bench();
// let run;
// (run = () => { step(); requestAnimationFrame(run) })()
// step();
