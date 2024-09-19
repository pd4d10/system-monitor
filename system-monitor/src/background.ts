import { runOnceOnStartup, setActionIcon } from "utils";
import { getSystemInfo } from "./utils";

const data = Array(19).fill(1);

runOnceOnStartup(() => {
  getSystemInfo(({ cpu: { modelName, usage } }: {
    cpu: {
      modelName: string;
      usage: chrome.system.cpu.ProcessorUsage[];
    };
  }) => {
    const idle = usage.reduce((a, b) => a + b.idle / b.total, 0) / usage.length;
    data.push(idle);
    data.shift();

    chrome.action.setTitle({
      title: `${modelName}\nUsage: ${(100 * (1 - idle)).toFixed(0)}%`,
    });
    setActionIcon(data, {
      color: "#4876ff",
      borderColor: "#1874cd",
    });
  });
});
