import { once } from "lodash-es";

export const runOnceOnStartup = (fn: (...args: any) => any) => {
  const init = once(fn);

  // for manifest v3 startup
  // https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension
  chrome.runtime.onStartup.addListener(init);

  // for reload/enable
  init();
};

let ctx: OffscreenCanvasRenderingContext2D | null = null;

export const setActionIcon = (data: number[], { color, borderColor }: {
  color: string;
  borderColor: string;
}) => {
  const SIZE = 19;
  const BORDER_WIDTH = 2;

  if (!ctx) {
    const canvas = new OffscreenCanvas(SIZE, SIZE);
    ctx = canvas.getContext("2d", {
      // https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-will-read-frequently
      willReadFrequently: true,
    })!;
  }

  // clear
  ctx.clearRect(0, 0, SIZE, SIZE);

  // main
  ctx.beginPath();
  ctx.moveTo(0, SIZE);
  for (let i = 0; i < SIZE; i++) {
    ctx.lineTo(i, data[i] * SIZE);
  }
  ctx.lineTo(SIZE, SIZE);
  ctx.lineWidth = 2;
  ctx.fillStyle = color;
  ctx.fill();

  // border
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, SIZE);
  ctx.lineTo(SIZE, SIZE);
  ctx.lineTo(SIZE, 0);
  ctx.closePath();
  ctx.lineWidth = BORDER_WIDTH;
  ctx.strokeStyle = borderColor;
  ctx.stroke();

  chrome.action.setIcon({
    imageData: ctx.getImageData(0, 0, SIZE, SIZE),
  });
};
