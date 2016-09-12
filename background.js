(function () {
  // Draw browser action icon with HTML5 canvas
  var SIZE = 19 // Icon size
  var TIMEOUT = 100
  var STROKE_COLOR = '#1874cd'
  var FILL_COLOR = '#4876ff'
  var canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE

  var c = canvas.getContext('2d')

  // define an array to storage idle CPU percent
  var cpuIdleArray = Array(SIZE)
  for (var i = 0; i < cpuIdleArray.length; i++) {
    cpuIdleArray[i] = 1
  }

  // Initialize
  var cpuInfo0
  var numOfProcessors
  var modelName

  chrome.system.cpu.getInfo(function (info) {
    cpuInfo0 = info
    numOfProcessors = info.numOfProcessors
    modelName = info.modelName
  })

  var draw = function () {
    // Get Idle CPU percent
    chrome.system.cpu.getInfo(function (info) {
      var cpuIdle = 0
      for (var i = 0; i < numOfProcessors; i++) {
        cpuIdle += (info.processors[i].usage.idle - cpuInfo0.processors[i].usage.idle) /
          (info.processors[i].usage.total - cpuInfo0.processors[i].usage.total) /
          numOfProcessors
      }
      cpuInfo0 = info
      cpuIdleArray.push(cpuIdle)
      cpuIdleArray.shift()

      // Show CPU information on mouse over
      chrome.browserAction.setTitle({
        title: modelName + '\nUsage: ' + (100 - cpuIdle * 100).toFixed(0) + '%'
      })

      c.clearRect(0, 0, SIZE, SIZE)

      // Draw CPU usage change
      c.beginPath()
      c.moveTo(0, SIZE)
      cpuIdleArray.forEach(function (cpu, i) {
        c.lineTo(i, cpu * SIZE)
      })
      c.lineTo(SIZE, SIZE)
      c.lineWidth = 2
      c.fillStyle = FILL_COLOR
      c.fill()

      // Draw border
      c.beginPath()
      c.moveTo(0, 0)
      c.lineTo(0, SIZE)
      c.lineTo(SIZE, SIZE)
      c.lineTo(SIZE, 0)
      c.closePath()
      c.lineWidth = 2
      c.strokeStyle = STROKE_COLOR
      c.stroke()

      chrome.browserAction.setIcon({
        imageData: c.getImageData(0, 0, SIZE, SIZE)
      })

      setTimeout(draw, TIMEOUT)
    })
  }

  // Draw icon
  setTimeout(draw, TIMEOUT)
})()
