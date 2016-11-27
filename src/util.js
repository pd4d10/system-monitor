import { map, get, zipWith } from 'lodash/fp'

const TIMEOUT = 1000

function getInfo(type) {
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

export async function trigger(cb, processorsOld = []) {
  const [cpu, memory] = await Promise.all([
    getInfo('cpu'),
    getInfo('memory'),
  ])

  const processors = map(get('usage'))(cpu.processors)

  // calculate CPU usage
  const cpuUsage = zipWith(minus, processors, processorsOld)

  cb({
    cpu: {
      ...cpu,
      usage: cpuUsage,
    },
    memory,
  })

  setTimeout(() => trigger(cb, processors), TIMEOUT)
}
