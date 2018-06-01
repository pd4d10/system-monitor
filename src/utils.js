const TIMEOUT = 1000

// Convert byte to GB
export function toGiga(byte) {
  return (byte / (1024 * 1024 * 1024)).toFixed(2)
}

function getCpuUsage(processors, processorsOld) {
  const usage = []
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
        : processor,
    )
  }
  return usage
}

export async function trigger(onlyCpu, cb, processorsOld = []) {
  let cpu
  let memory
  let storage
  if (onlyCpu) {
    cpu = await new Promise(r => chrome.system.cpu.getInfo(r))
  } else {
    ;[cpu, memory, storage] = await Promise.all(
      ['cpu', 'memory', 'storage'].map(
        item => new Promise(r => chrome.system[item].getInfo(r)),
      ),
    )
  }
  const processors = cpu.processors.map(({ usage }) => usage)
  const data = {
    cpu: {
      modelName: cpu.modelName,
      usage: getCpuUsage(processors, processorsOld),
    },
    memory,
    storage,
  }
  cb(data)
  setTimeout(() => trigger(onlyCpu, cb, processors), TIMEOUT)
}
