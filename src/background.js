// icon size
const SIZE = 19

// timeout
const TIMEOUT = 1000

// border width
const BORDER_WIDTH = 2

// draw browser action icon with HTML5 canvas
const canvas = document.createElement('canvas')
canvas.width = SIZE
canvas.height = SIZE
const context = canvas.getContext('2d')

// color config
const config = {
  cpu: {
    border: '#1874cd',
    background: '#4876ff',
  },
  memory: {
    border: '#008744',
    background: '#66cdaa',
  }
}

/**
 *
 * @param type
 */
const getInfo = type => new Promise((resolve, reject) => {
  try {
    chrome.system[type].getInfo(function (info) {
      resolve(info)
    })
  } catch (err) {
    reject(err)
  }
})

// define an array to storage idle CPU percent
const cpuIdleArray = Array(SIZE)
for (let i = 0; i < cpuIdleArray.length; i++) {
  cpuIdleArray[i] = 1
}

const memoryIdleArray = Array(SIZE)
for (let i = 0; i < memoryIdleArray.length; i++) {
  memoryIdleArray[i] = 1
}

// Initialize
let initialized = false
let cpuInfo0
let memInfo0
let numOfProcessors
let modelName

const clear = () => {
  context.clearRect(0, 0, SIZE, SIZE)
}

/**
 *
 * @param color
 */
const drawBorder = color => {
  context.beginPath()
  context.moveTo(0, 0)
  context.lineTo(0, SIZE)
  context.lineTo(SIZE, SIZE)
  context.lineTo(SIZE, 0)
  context.closePath()
  context.lineWidth = 2
  context.strokeStyle = color
  context.stroke()
}

/**
 *
 * @param color
 * @param arr
 */
const drawBackground = (color, arr) => {
  context.beginPath()
  context.moveTo(0, SIZE)
  arr.forEach(function (cpu, i) {
    context.lineTo(i, cpu * SIZE)
  })
  context.lineTo(SIZE, SIZE)
  context.lineWidth = 2
  context.fillStyle = color
  context.fill()
}

const drawLine = (color, arr) => {
  context.beginPath()
  context.moveTo(0, 0)
  arr.forEach((cpu, i) => {
    context.lineTo(i, cpu * SIZE)
  })
  context.lineWidth = 1
  context.strokeStyle = color
  context.stroke()
}

const { setTitle, setIcon } = chrome.browserAction

/**
 *
 */
const draw = () => {
  if (!initialized) {
    chrome.system.cpu.getInfo(function (info) {
      cpuInfo0 = info
      numOfProcessors = info.numOfProcessors
      modelName = info.modelName
    })
    initialized = true
    setTimeout(draw, TIMEOUT)
    return
  }

  Promise.all(['cpu', 'memory'].map(getInfo))
    .then(([info, mem]) => {
      let cpuIdle = 0
      for (let i = 0; i < numOfProcessors; i++) {
        cpuIdle += (info.processors[i].usage.idle - cpuInfo0.processors[i].usage.idle) /
          (info.processors[i].usage.total - cpuInfo0.processors[i].usage.total) /
          numOfProcessors
      }
      cpuInfo0 = info
      cpuIdleArray.push(cpuIdle)
      cpuIdleArray.shift()

      // memInfo0 = mem
      // memoryIdleArray.push(mem.availableCapacity / mem.capacity)
      // memoryIdleArray.shift()

      setTitle({
        title: `${modelName}\nUsage: ${(100 - cpuIdle * 100).toFixed(0)}%`
      })

      clear()
      drawBackground(config.cpu.background, cpuIdleArray)
      drawBorder(config.cpu.border)
      // drawLine(config.memory.border, memoryIdleArray)

      setIcon({
        imageData: context.getImageData(0, 0, SIZE, SIZE)
      })

      setTimeout(draw, TIMEOUT)
    })
}

// Draw icon
draw()
