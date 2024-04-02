import { ReadonlyArray } from "effect";

const TIMEOUT = 1000;

// Convert byte to GB
export function toGiga(byte: number) {
  return (byte / (1024 * 1024 * 1024)).toFixed(2);
}

interface SystemInfoData {
  cpu: {
    modelName: chrome.system.cpu.CpuInfo["modelName"];
    usage: chrome.system.cpu.ProcessorUsage[];
    temperatures?: number[];
  };
  memory: chrome.system.memory.MemoryInfo;
  storage: chrome.system.storage.StorageUnitInfo[];
}

interface UserSettings {
  cpu?: boolean;
  memory?: boolean;
  battery?: boolean;
  storage?: boolean;
}

const isValid = (p: chrome.system.cpu.ProcessorUsage) => {
  // https://github.com/pd4d10/system-monitor/issues/3
  return p.total > 0;
};

export async function getSystemInfo(
  cb: (data: SystemInfoData) => void,
  processorsOld: chrome.system.cpu.ProcessorUsage[] = [],
) {
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

  const processors = cpu.processors.map(({ usage }) => usage);

  const data: SystemInfoData = {
    cpu: {
      modelName: cpu.modelName,
      usage: ReadonlyArray.zipWith(
        ReadonlyArray.filter<chrome.system.cpu.ProcessorUsage>(
          processors,
          isValid,
        ),
        ReadonlyArray.filter(processorsOld, isValid),
        (processor, processorOld) => {
          return {
            user: processor.user - processorOld.user,
            kernel: processor.kernel - processorOld.kernel,
            idle: processor.idle - processorOld.idle,
            total: processor.total - processorOld.total,
          };
        },
      ),
      temperatures: (cpu as any).temperatures ?? [], // chromeos only, https://developer.chrome.com/docs/extensions/reference/system_cpu/#type-CpuInfo
      // temperatures: [40, 50],
    },
    memory,
    storage,
  };

  cb(data);

  setTimeout(() => {
    getSystemInfo(cb, processors);
  }, TIMEOUT);
}

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
