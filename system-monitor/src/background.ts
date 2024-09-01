import { getSystemInfo } from "./utils";

const SIZE = 19; // Icon size
const BORDER_WIDTH = 2;

// Draw browser action icon with HTML5 canvas
const canvas = new OffscreenCanvas(SIZE, SIZE);
const ctx = canvas.getContext("2d", {
  // https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-will-read-frequently
  willReadFrequently: true,
})!;

// Color config
const config = {
  cpu: {
    border: "#1874cd",
    background: "#4876ff",
  },
  memory: {
    border: "#008744",
    background: "#66cdaa",
  },
};

// 3 => [1, 1, 1]
function fill(count: number) {
  const arr = [];
  for (let i = 0; i < count; i += 1) {
    arr.push(1);
  }
  return arr;
}
const cpuIdleArray = fill(SIZE);

function clear() {
  ctx.clearRect(0, 0, SIZE, SIZE);
}

function drawBorder(color: string) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, SIZE);
  ctx.lineTo(SIZE, SIZE);
  ctx.lineTo(SIZE, 0);
  ctx.closePath();
  ctx.lineWidth = BORDER_WIDTH;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawBackground(color: string, arr: number[]) {
  ctx.beginPath();
  ctx.moveTo(0, SIZE);
  arr.forEach((cpu, i) => {
    ctx.lineTo(i, cpu * SIZE);
  });
  ctx.lineTo(SIZE, SIZE);
  ctx.lineWidth = 2;
  ctx.fillStyle = color;
  ctx.fill();
}

getSystemInfo(({ cpu: { modelName, usage } }: {
  cpu: {
    modelName: string;
    usage: chrome.system.cpu.ProcessorUsage[];
  };
}) => {
  const idle = usage.reduce((a, b) => a + b.idle / b.total, 0) / usage.length;
  cpuIdleArray.push(idle);
  cpuIdleArray.shift();
  chrome.action.setTitle({
    title: `${modelName}\nUsage: ${(100 * (1 - idle)).toFixed(0)}%`,
  });
  clear();
  drawBackground(config.cpu.background, cpuIdleArray);
  drawBorder(config.cpu.border);
  chrome.action.setIcon({
    imageData: ctx.getImageData(0, 0, SIZE, SIZE),
  });
});
