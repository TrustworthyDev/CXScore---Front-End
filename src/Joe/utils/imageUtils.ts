import { ACCESSTOKEN_KEY } from "../../Sameer/lib/application/use-login";

const baseUrl = import.meta.env.VITE_API_URL;

export const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  const len = buffer.byteLength;
  let resStr = "";
  for (let i = 0; i < len / 1024; i++) {
    resStr += String.fromCharCode(
      ...new Uint8Array(buffer.slice(i * 1024, (i + 1) * 1024))
    );
  }
  return btoa(resStr);
};

export const fetchImgWithAuthentication = (url: string): Promise<string> => {
  const normalizedUrl = url.startsWith('/') ? url.substring(1) : url;
  const headers = new Headers();
  const authToken = localStorage.getItem(ACCESSTOKEN_KEY);
  headers.set("Authorization", `Bearer ${authToken}`);
  return fetch(`${baseUrl}/${normalizedUrl}`, { method: "GET", headers })
    .then((res) => res.arrayBuffer())
    .then(arrayBufferToBase64)
    .then((res) => {
      return "data:image/png;base64," + res;
    });
};

export const drawViolationBoundsOverBase64Image = (
  base64Image: string | null,
  bounds: BoundingBox
) => {
  if (!base64Image) throw new Error("No base64 image");
  const img = new Image();
  img.src = base64Image;
  const canvas = document.createElement("canvas");
  // extend canvas width to fit text
  canvas.width = img.width + 400;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas ctx");

  ctx.drawImage(img, 0, 0);

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, img.width, img.height);

  // draw box over bounds, no fill, red stroke

  ctx.font = "32px sans-serif";
  ctx.fillStyle = "white";

  ctx.lineWidth = 6;
  ctx.strokeStyle = "red";
  try {
    const xw = bounds.x + bounds.w;
    const yh = bounds.y + bounds.h;
    if (xw > img.width) {
      bounds.w = img.width - bounds.x;
    }
    if (yh > img.height) {
      bounds.h = img.height - bounds.y;
    }
    ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);

    if (bounds.w > 0 && bounds.h > 0) {
      // draw text to the right side of image at bounds height
      ctx.fillText(
        "Violation Here",
        img.width + 25,
        bounds.y + bounds.h / 2,
        350
      );
    } else {
      ctx.fillText("Needs manual validation", img.width + 25, 100, 350);
    }
  } catch (e) {
    ctx.fillText(
      "Violation highlighting not applicable",
      img.width + 25,
      100,
      350
    );
  }
  return canvas.toDataURL("image/jpeg", 1);
};

export class DrawCanvasUtil {
  canvas: HTMLCanvasElement;
  sx: number;
  sy: number;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.sx = this.sy = 25;
  }

  getContext() {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas ctx");
    return ctx;
  }

  setBase64Image(base64Image: string) {
    const img = new Image();
    img.src = base64Image;
    this.canvas.width = img.width + this.sx * 2;
    this.canvas.height = img.height + this.sy * 2;

    const ctx = this.getContext();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(img, this.sx, this.sy);
  }

  drawBoundingRect(
    rect: Rectangle,
    strokeStyle: string | CanvasGradient | CanvasPattern,
    lineWidth: number = 1
  ) {
    const ctx = this.getContext();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(rect.x + this.sx, rect.y + this.sy, rect.w, rect.h);
  }

  drawCircleText(
    text: string,
    x: number,
    y: number,
    fillStyle: string | CanvasGradient | CanvasPattern,
    fontSize: number = 12,
    fontFamily: string = "sans-serif",
    otherFontStyle: string = ""
  ) {
    const cx = x + this.sx;
    const cy = y + this.sy;
    const ctx = this.getContext();
    ctx.font = `${fontSize}px ${fontFamily} ${otherFontStyle}`;
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(cx, cy, fontSize + 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, cx, cy);
  }

  toImage(imageType: string = "image/jpeg", quality = 1) {
    return this.canvas.toDataURL(imageType, quality);
  }
}
