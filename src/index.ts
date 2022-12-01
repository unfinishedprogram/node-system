import NodeSystem from "./node_system";
import Wikipedia from "./wikipedia";
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

let system = new NodeSystem();

document.querySelector("#svg_container")?.appendChild(system.element);

const center = system.addNode("India");
center.locked = true;
center.setPosition(1000, 1000);

const step = () => {
    system.step();
    system.draw();
}

const appendNode = () => {
    return new Promise(res => {
        let r = system.randNode();
        Wikipedia.getRandomArticle().then(name => res(r.addChild(name)));
    })
}

let deltaT = 0;

let deltas = [0, 0, 0, 0];

const setup = async () => {
    for (let i = 0; i < 300; i++) {
        await appendNode();
    }
    console.log("DONE")
}

setup()

// 80fps

const bench = () => {
    let t = performance.now();
    step();

    // if (Math.random() > 0.98) appendNode()

    deltaT = performance.now() - t;
    deltas.splice(0, 1);
    deltas.push(deltaT);

    if (system.nodes.length % 10 == 0) {
        // console.log(system.nodes.length / deltaT, system.nodes.length, deltaT);
    }

    if (Math.min(Math.min(Math.min(deltas[0], deltas[1], deltas[2], deltas[3]))) < 16) {
        requestAnimationFrame(bench);
    } else {
        // console.log("DONE:", system.nodes.length)
    }
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
