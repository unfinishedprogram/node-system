import Vec2 from "./vec2";

export default class HashGrid<T extends { id: number, position: Vec2 }> {
    grid: T[][][] = [];
    items: T[];


    private readonly _result: T[] = [];
    private readonly _bins: T[][] = [];
    private readonly _set: Set<T> = new Set();

    width: number;
    height: number;

    constructor(
        public readonly gridSize: number,
        public readonly size: Vec2
    ) {
        this.initGrid();
    }

    hash(v: number) {
        return Math.floor((v - this.gridSize / 2) / this.gridSize);
    }

    initGrid() {
        this.width = Math.ceil(this.size.x / this.gridSize);
        this.height = Math.ceil(this.size.y / this.gridSize);

        for (let x = 0; x < this.width; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.grid[x][y] = [];
            }
        }
    }

    resetGrid() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.grid[x][y].length = 0;
            }
        }
    }

    getAdj(item: T) {
        const x = this.hash(item.position.x);
        const y = this.hash(item.position.y);
        // this._set.clear();

        this._bins[0] = this.getBin(x, y);
        this._bins[1] = this.getBin(x + 1, y);
        this._bins[2] = this.getBin(x, y + 1);
        this._bins[3] = this.getBin(x + 1, y + 1);

        this._result.length = 0;
        for (const bin of this._bins) {
            for (const item of bin) {
                if (!this._result.includes(item)) {
                    this._result.push(item);
                }
            }
        }

        return this._result;
    }

    getBin(x: number, y: number) {
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x >= this.width) x = this.width - 1;
        if (y >= this.height) y = this.height - 1;
        return this.grid[x][y];
    }

    addItem(item: T) {
        let x = Math.floor((item.position.x - this.gridSize / 2) / this.gridSize);
        let y = Math.floor((item.position.y - this.gridSize / 2) / this.gridSize);

        this.addToBin(item, x, y);
        this.addToBin(item, x + 1, y);
        this.addToBin(item, x, y + 1);
        this.addToBin(item, x + 1, y + 1);
    }

    addToBin(item: T, x: number, y: number) {
        this.getBin(x, y).push(item);
    }
}