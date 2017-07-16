const TIMEOUT = 1000

type CpuInfo = chrome.system.cpu.CpuInfo
type ProcessorUsage = chrome.system.cpu.ProcessorUsage
export type MemoryInfo = chrome.system.memory.MemoryInfo
export type StorageUnitInfo = chrome.system.storage.StorageUnitInfo

export interface ParsedCpuInfo {
  modelName: string
  usage: ProcessorUsage[]
}

// Convert byte to GB
export function toGiga(byte: number) {
  return (byte / (1024 * 1024 * 1024)).toFixed(2)
}

export interface State {
  cpu: ParsedCpuInfo
  memory: MemoryInfo
  storage: StorageUnitInfo[]
}

function getCpuUsage(
  processors: ProcessorUsage[],
  processorsOld: ProcessorUsage[]
) {
  const usage: ProcessorUsage[] = []
  for (let i = 0; i < processors.length; i++) {
    const processor = processors[i]
    const processorOld = processorsOld[i]
    usage.push(
      processorOld
        ? {
            user: processor.user - processorOld.user,
            kernel: processor.kernel - processorOld.kernel,
            idle: processor.idle - processorOld.idle,
            total: processor.total - processorOld.total,
          }
        : processor
    )
  }
  return usage
}

export async function trigger(
  cb: (data: State) => void,
  processorsOld: ProcessorUsage[] = []
) {
  const cpuP = new Promise<CpuInfo>(resolve =>
    chrome.system.cpu.getInfo(resolve)
  )
  const memoryP = new Promise<MemoryInfo>(resolve =>
    chrome.system.memory.getInfo(resolve)
  )
  const storageP = new Promise<StorageUnitInfo[]>(resolve =>
    chrome.system.storage.getInfo(resolve)
  )

  const [cpu, memory, storage] = await Promise.all([cpuP, memoryP, storageP])
  const processors = cpu.processors.map(({ usage }) => usage)

  const cpuUsage = getCpuUsage(processors, processorsOld)
  const data: State = {
    cpu: {
      modelName: cpu.modelName,
      usage: cpuUsage,
    },
    memory,
    storage,
  }

  cb(data)
  setTimeout(() => trigger(cb, processors), TIMEOUT)
}
