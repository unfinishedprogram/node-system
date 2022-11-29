export default class HashSet<T> {
    constructor(private readonly hash: (item: T) => number) { }

    private items: { [key: number]: T } = {};

    add(...items: T[]) {
        for (let item of items) {
            this.items[this.hash(item)] = item;
        }
    }

    has(item: T) {
        return this.hash(item) in this.items;
    }

    remove(item: T) {
        delete this.items[this.hash(item)];
    }

    clear() {
        this.items = {};
    }

    toArray() {
        return Object.values(this.items);
    }
}