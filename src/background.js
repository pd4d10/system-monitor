import { trigger } from './utils'

const SIZE = 19 // Icon size
const BORDER_WIDTH = 2

// Draw browser action icon with HTML5 canvas
const canvas = document.createElement('canvas')
canvas.width = SIZE
canvas.height = SIZE
const ctx = canvas.getContext('2d')

// Color config
const config = {
  cpu: {
    border: '#1874cd',
    background: '#4876ff',
  },
  memory: {
    border: '#008744',
    background: '#66cdaa',
  },
}

// 3 => [1, 1, 1]
function fill(count) {
  const arr = []
  for (let i = 0; i < count; i += 1) {
    arr.push(1)
  }
  return arr
}
const cpuIdleArray = fill(SIZE)

function clear() {
  ctx.clearRect(0, 0, SIZE, SIZE)
}

function drawBorder(color) {
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(0, SIZE)
  ctx.lineTo(SIZE, SIZE)
  ctx.lineTo(SIZE, 0)
  ctx.closePath()
  ctx.lineWidth = BORDER_WIDTH
  ctx.strokeStyle = color
  ctx.stroke()
}

function drawBackground(color, arr) {
  ctx.beginPath()
  ctx.moveTo(0, SIZE)
  arr.forEach((cpu, i) => {
    ctx.lineTo(i, cpu * SIZE)
  })
  ctx.lineTo(SIZE, SIZE)
  ctx.lineWidth = 2
  ctx.fillStyle = color
  ctx.fill()
}

trigger(({ cpu: { modelName, usage } }) => {
  const idle = usage.reduce((a, b) => a + b.idle / b.total, 0) / usage.length
  cpuIdleArray.push(idle)
  cpuIdleArray.shift()
  chrome.browserAction.setTitle({
    title: `${modelName}\nUsage: ${(100 * (1 - idle)).toFixed(0)}%`,
  })
  clear()
  drawBackground(config.cpu.background, cpuIdleArray)
  drawBorder(config.cpu.border)
  chrome.browserAction.setIcon({
    imageData: ctx.getImageData(0, 0, SIZE, SIZE),
  })
})
