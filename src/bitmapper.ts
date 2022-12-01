export default class Rasterizer {
    private imageCache = new Map<string, string>();
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(private resolution = 64) {
        this.resetCanvas();
    }

    // Used for when the canvas becomes tainted
    private resetCanvas() {
        this.canvas?.remove()
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.resolution;
        this.canvas.height = this.resolution;
        this.ctx = this.canvas.getContext("2d")!;
    }

    private clearCanvas() {
        this.ctx.clearRect(0, 0, this.resolution, this.resolution);
    }

    // Renders a given image from a url, and returns a base64 encoded version
    public async rasterize(url: string): Promise<string> {
        let cached = this.imageCache.get(url);
        if (cached) return cached;

        return new Promise(res => {
            const img = document.createElement("img");
            img.src = url;
            img.crossOrigin = "anonymous";
            img.onload = () => {
                this.clearCanvas();
                this.ctx.drawImage(img, 0, 0, this.resolution, this.resolution);
            }
            try {
                let str = this.canvas.toDataURL();
                this.imageCache.set(url, str);
                res(str);
            } catch (e) {
                console.error("Image corrupted canvas")
                this.resetCanvas();
            }
        })
    }
}