import { zipWith } from 'lodash'

const TIMEOUT = 1000

type CpuInfo = chrome.system.cpu.CpuInfo
type ProcessorUsage = chrome.system.cpu.ProcessorUsage
export type MemoryInfo = chrome.system.memory.MemoryInfo
type StorageUnitInfo = chrome.system.storage.StorageUnitInfo

export interface ParsedCpuInfo {
    modelName: string
    usage: ProcessorUsage[]
  }

// Convert byte to GB
export function toGiga(byte: number) {
  return (byte / (1024 * 1024 * 1024)).toFixed(2)
}

function minus(
  usage: ProcessorUsage,
  oldUsage: ProcessorUsage = {
    user: 0,
    kernel: 0,
    idle: 0,
    total: 0,
  }
) {
  const data: ProcessorUsage = {
    user: usage.user - oldUsage.user,
    kernel: usage.kernel - oldUsage.kernel,
    idle: usage.idle - oldUsage.idle,
    total: usage.total - oldUsage.total,
  }
  return data
}

export interface State {
  cpu: ParsedCpuInfo
  memory: MemoryInfo
  storage: StorageUnitInfo[]
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

  const cpuUsage = zipWith<ProcessorUsage>(processors, processorsOld, minus)
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
