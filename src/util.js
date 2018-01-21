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
export async function trigger(cb, processorsOld = []) {
  const cpuP = new Promise(resolve => chrome.system.cpu.getInfo(resolve))
  const memoryP = new Promise(resolve => chrome.system.memory.getInfo(resolve))
  const storageP = new Promise(resolve =>
    chrome.system.storage.getInfo(resolve),
  )
  const [cpu, memory, storage] = await Promise.all([cpuP, memoryP, storageP])
  const processors = cpu.processors.map(({ usage }) => usage)
  const cpuUsage = getCpuUsage(processors, processorsOld)
  const data = {
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
