const TIMEOUT = 1000

// Convert byte to GB
export function toGiga(byte: number) {
  return (byte / (1024 * 1024 * 1024)).toFixed(2)
}

function getCpuUsage(
  processors: chrome.system.cpu.ProcessorUsage[],
  processorsOld: chrome.system.cpu.ProcessorUsage[],
) {
  const usage = []
  for (let i = 0; i < processors.length; i++) {
    const processor = processors[i]

    // https://github.com/pd4d10/system-monitor/issues/3
    if (processor.total === 0) continue

    const processorOld = processorsOld[i]
    usage.push(
      processorOld
        ? {
            user: processor.user - processorOld.user,
            kernel: processor.kernel - processorOld.kernel,
            idle: processor.idle - processorOld.idle,
            total: processor.total - processorOld.total,
          }
        : processor,
    )
  }
  return usage
}

interface SystemInfoData {
  cpu: {
    modelName: chrome.system.cpu.CpuInfo['modelName']
    usage: chrome.system.cpu.ProcessorUsage[]
    temperatures?: number[]
  }
  memory: chrome.system.memory.MemoryInfo
  storage: chrome.system.storage.StorageUnitInfo[]
}

interface UserSettings {
  cpu?: boolean
  memory?: boolean
  battery?: boolean
  storage?: boolean
}

export async function getSystemInfo(
  status: UserSettings,
  cb: (data: SystemInfoData) => void,
  processorsOld: chrome.system.cpu.ProcessorUsage[] = [],
) {
  const [cpu, memory, storage] = await Promise.all([
    new Promise<chrome.system.cpu.CpuInfo>((resolve) => {
      chrome.system.cpu.getInfo((v) => resolve(v))
    }),
    new Promise<chrome.system.memory.MemoryInfo>((resolve) => {
      chrome.system.memory.getInfo((v) => resolve(v))
    }),
    new Promise<chrome.system.storage.StorageUnitInfo[]>((resolve) => {
      chrome.system.storage.getInfo((v) => resolve(v))
    }),
  ])

  const processors = cpu.processors.map(({ usage }) => usage)
  const data: SystemInfoData = {
    cpu: {
      modelName: cpu.modelName,
      usage: getCpuUsage(processors, processorsOld),
      temperatures: (cpu as any).temperatures ?? [], // chromeos only, https://developer.chrome.com/docs/extensions/reference/system_cpu/#type-CpuInfo
      // temperatures: [40, 50],
    },
    memory,
    storage,
  }

  cb(data)

  setTimeout(() => {
    getSystemInfo(status, cb, processors)
  }, TIMEOUT)
}

export const storage = {
  getPopupStatus() {
    return new Promise<UserSettings>((resolve) => {
      chrome.storage.sync.get((res) => {
        if (!res.popup) res.popup = {}
        const {
          cpu = true,
          memory = true,
          battery = true,
          storage = true,
        } = res.popup
        resolve({ cpu, memory, battery, storage })
      })
    })
  },
  setPopupStatus(popup: UserSettings) {
    return new Promise<void>((resolve) => {
      chrome.storage.sync.set({ popup }, () => {
        resolve()
      })
    })
  },
}
