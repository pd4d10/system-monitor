import { trigger } from './util'

const SIZE = 19 // Icon size
const BORDER_WIDTH = 2

// Draw browser action icon with HTML5 canvas
const canvas = document.createElement('canvas')
canvas.width = SIZE
canvas.height = SIZE
const context: CanvasRenderingContext2D = canvas.getContext('2d')

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
function fill(count: number) {
  const arr = []
  for (let i = 0; i < count; i += 1) {
    arr.push(1)
  }
  return arr
}

const { setTitle, setIcon } = chrome.browserAction
const cpuIdleArray = fill(SIZE)

function clear() {
  context.clearRect(0, 0, SIZE, SIZE)
}

function drawBorder(color: string) {
  context.beginPath()
  context.moveTo(0, 0)
  context.lineTo(0, SIZE)
  context.lineTo(SIZE, SIZE)
  context.lineTo(SIZE, 0)
  context.closePath()
  context.lineWidth = BORDER_WIDTH
  context.strokeStyle = color
  context.stroke()
}

function drawBackground(color: string, arr: number[]) {
  context.beginPath()
  context.moveTo(0, SIZE)
  arr.forEach((cpu, i) => {
    context.lineTo(i, cpu * SIZE)
  })
  context.lineTo(SIZE, SIZE)
  context.lineWidth = 2
  context.fillStyle = color
  context.fill()
}

function draw({
  cpu: { modelName, numOfProcessors, usage },
}) {
  const idle = usage.reduce((a, b) => a + (b.idle / b.total), 0) / numOfProcessors
  cpuIdleArray.push(idle)
  cpuIdleArray.shift()

  setTitle({
    title: `${modelName}\nUsage: ${(100 * (1 - idle)).toFixed(0)}%`,
  })

  clear()
  drawBackground(config.cpu.background, cpuIdleArray)
  drawBorder(config.cpu.border)

  setIcon({ imageData: context.getImageData(0, 0, SIZE, SIZE) })
}

trigger(draw)
