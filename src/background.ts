import { Effect, Schedule } from "effect";
import { getSystemInfo } from "./utils";

const canvas = new OffscreenCanvas(19, 19);
const ctx = canvas.getContext("2d")!;

const cpuIdleArray = Array.from(Array(19), () => 1);

const draw = ({
  processors,
  cpu,
}: Awaited<ReturnType<typeof getSystemInfo>>) => {
  const idle =
    processors.reduce((a, b) => {
      return a + b.usage.idle / b.usage.total;
    }, 0) / cpu.processors.length;
  const c = (100 * (1 - idle)).toFixed();
  chrome.browserAction.setTitle({
    title: "" + cpu.modelName + "\nUsage: " + c + "%",
  });
  cpuIdleArray.push(idle);
  cpuIdleArray.shift();

  // clear
  ctx.clearRect(0, 0, 19, 19);

  // background
  ctx.beginPath();
  ctx.moveTo(0, 19);
  cpuIdleArray.forEach((v, i) => {
    ctx.lineTo(i, v * 19);
  });
  ctx.lineTo(19, 19);
  ctx.lineWidth = 2;
  ctx.fillStyle = "#4876ff";
  ctx.fill();

  // border
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 19);
  ctx.lineTo(19, 19);
  ctx.lineTo(19, 0);
  ctx.closePath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#1874cd";
  ctx.stroke();

  chrome.browserAction.setIcon({
    imageData: ctx.getImageData(0, 0, 19, 19),
  });
};

Effect.runPromise(
  Effect.repeat(
    Effect.promise(getSystemInfo).pipe(Effect.map(draw)),
    Schedule.spaced(1000),
  ),
);
