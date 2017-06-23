import { map, get, zipWith } from 'lodash/fp'

const TIMEOUT = 1000

function getInfo(type: 'cpu' | 'memory' | 'storage') {
  return new Promise((resolve, reject) => {
    try {
      chrome.system[type].getInfo(resolve)
    } catch (err) {
      reject(err)
    }
  })
}

function minus(a, b = {
  user: 0,
  kernel: 0,
  idle: 0,
  total: 0,
}) {
  return {
    user: a.user - b.user,
    kernel: a.kernel - b.kernel,
    idle: a.idle - b.idle,
    total: a.total - b.total,
  }
}

//  chrome.system.cpu.CpuInfo | chrome.system.memory.MemoryInfo | chrome.system.storage.StorageUnitInfo[]
export async function trigger(cb, processorsOld = []) {
  const [cpu, memory, storage] = await Promise.all(map(getInfo)([
    'cpu',
    'memory',
    'storage',
  ]))

  const processors = map(get('usage'))(cpu.processors)

  // calculate CPU usage
  const cpuUsage = zipWith(minus, processors, processorsOld)

  cpu.usage = cpuUsage

  cb({
    cpu,
    memory,
    storage,
  })

  setTimeout(() => trigger(cb, processors), TIMEOUT)
}

// convert byte to GB
export function giga(byte: number) {
  return (byte / (1024 * 1024 * 1024)).toFixed(2)
}
