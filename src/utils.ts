const TIMEOUT = 1000;

// Convert byte to GB
export function toGiga(byte: number) {
  return (byte / (1024 * 1024 * 1024)).toFixed(2);
}

function getCpuUsage(
  processors: chrome.system.cpu.ProcessorUsage[],
  processorsOld: chrome.system.cpu.ProcessorUsage[],
) {
  const usage = [];
  for (let i = 0; i < processors.length; i++) {
    const processor = processors[i];

    // https://github.com/pd4d10/system-monitor/issues/3
    if (processor.total === 0) continue;

    const processorOld = processorsOld[i];
    usage.push(
      processorOld
        ? {
          user: processor.user - processorOld.user,
          kernel: processor.kernel - processorOld.kernel,
          idle: processor.idle - processorOld.idle,
          total: processor.total - processorOld.total,
        }
        : processor,
    );
  }
  return usage;
}

type Status = { cpu?: boolean; memory?: boolean; storage?: boolean; battery?: boolean };

export async function getSystemInfo(
  status: Status,
  cb: (data: {
    cpu: {
      modelName: string;
      usage: any[]; //  temperatures?: number[]
    };
    memory: { capacity: number; availableCapacity: number };
    storage: { storage: { name: string; capacity: number; id: string }[] };
  }) => void,
  processorsOld: chrome.system.cpu.ProcessorUsage[] = [],
) {
  const items = await Promise.all(
    (["cpu", "memory", "storage"] as const).map((item) => {
      if (status[item]) {
        return new Promise((resolve) => {
          chrome.system[item].getInfo(resolve);
        });
      } else {
        return Promise.resolve(null);
      }
    }),
  );

  const [cpu, memory, storage] = items as [
    chrome.system.cpu.CpuInfo | null,
    chrome.system.memory.MemoryInfo | null,
    { storage: { name: string; capacity: number; id: string }[] } | null,
  ];

  const data: any = {};
  let processors: chrome.system.cpu.ProcessorUsage[];
  if (cpu) {
    processors = cpu.processors.map(({ usage }) => usage);
    data.cpu = {
      modelName: cpu.modelName,
      usage: getCpuUsage(processors, processorsOld),

      // @ts-ignore only chrome os
      temperatures: cpu.temperatures || [],
      // temperatures: [40, 50],
    };
  }
  if (memory) data.memory = memory;
  if (storage) data.storage = { storage };

  cb(data);
  setTimeout(() => getSystemInfo(status, cb, processors), TIMEOUT);
}

export const storage = {
  getPopupStatus() {
    return new Promise<Required<Status>>((resolve) => {
      chrome.storage.sync.get((res) => {
        if (!res.popup) res.popup = {};
        const {
          cpu = true,
          memory = true,
          battery = true,
          storage = true,
        } = res.popup;
        resolve({ cpu, memory, battery, storage });
      });
    });
  },
  setPopupStatus(popup: Status) {
    return new Promise<void>((resolve) => {
      chrome.storage.sync.set({ popup }, () => {
        resolve();
      });
    });
  },
};
