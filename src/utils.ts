import { Effect, ReadonlyArray } from "effect";

// Convert byte to GB
export function toGiga(byte: number) {
  return (byte / (1024 * 1024 * 1024)).toFixed(2);
}

interface UserSettings {
  cpu?: boolean;
  memory?: boolean;
  battery?: boolean;
  storage?: boolean;
}

const isValid = (p: chrome.system.cpu.ProcessorInfo) => {
  // https://github.com/pd4d10/system-monitor/issues/3
  return p.usage.total > 0;
};

let lastProcessors: chrome.system.cpu.ProcessorInfo[] = [];

export const getSystemInfo = async () => {
  const [cpu, memory, storage] = await Promise.all([
    new Promise<chrome.system.cpu.CpuInfo>((resolve) => {
      chrome.system.cpu.getInfo((v) => resolve(v));
    }),
    new Promise<chrome.system.memory.MemoryInfo>((resolve) => {
      chrome.system.memory.getInfo((v) => resolve(v));
    }),
    new Promise<chrome.system.storage.StorageUnitInfo[]>((resolve) => {
      chrome.system.storage.getInfo((v) => resolve(v));
    }),
  ]);

  const processors = ReadonlyArray.zipWith(
    ReadonlyArray.filter<chrome.system.cpu.ProcessorInfo>(
      cpu.processors,
      isValid,
    ),
    ReadonlyArray.filter(lastProcessors, isValid),
    (p, p0) => {
      return {
        usage: {
          user: p.usage.user - p0.usage.user,
          kernel: p.usage.kernel - p0.usage.kernel,
          idle: p.usage.idle - p0.usage.idle,
          total: p.usage.total - p0.usage.total,
        },
      };
    },
  );

  lastProcessors = cpu.processors;

  return { cpu, memory, storage, processors };
};

export const getPopupStatus = () => {
  return new Promise<UserSettings>((resolve) => {
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
};

export const setPopupStatus = (popup: UserSettings) => {
  return new Promise<void>((resolve) => {
    chrome.storage.sync.set({ popup }, () => {
      resolve();
    });
  });
};
