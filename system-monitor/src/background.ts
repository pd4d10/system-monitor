import { runOnceOnStartup, setActionIcon } from "utils";
import { getSystemInfo } from "./utils";

const SIZE = 19;

const config = {
  cpu: {
    border: "#1874cd",
    background: "#4876ff",
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

runOnceOnStartup(() => {
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
    setActionIcon(cpuIdleArray, {
      color: config.cpu.background,
      borderColor: config.cpu.border,
    });
  });
});
