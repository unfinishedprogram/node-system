const canvas = document.createElement("canvas");

const ctx = canvas.getContext("2d")!;
const _s = 128;
const [w, h] = [_s, _s];

canvas.width = w;
canvas.height = h;

export default function makeBitmap(url: string): Promise<string> {
    return new Promise((res, _) => {
        const img = document.createElement("img");
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);
            res(canvas.toDataURL());
        }
    });
}