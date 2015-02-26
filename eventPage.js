(function () {

  // Draw browser action icon with HTML5 canvas
  document.write('<canvas id="canvas"></canvas>');

  var SIZE = 19; // Icon size
  var canvas = document.getElementById('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;

  var c = canvas.getContext("2d");

  // define an array to storage idle CPU percent
  var cpuIdleArray = Array(SIZE);
  for (var i = cpuIdleArray.length; i--; ) {
    cpuIdleArray[i] = 1;
  }

  // Initialize
  var cpuInfo0;
  var numOfProcessors;
  var modelName;

  chrome.system.cpu.getInfo(function (info) {
    cpuInfo0 = info;
    numOfProcessors = info.numOfProcessors;
    modelName = info.modelName;
  });

  // Draw icon
  setInterval(draw, 1000);

  function draw() {

    // Get Idle CPU percent
    chrome.system.cpu.getInfo(function (info) {
      var cpuIdle = 0;
      for (var i = 0; i < numOfProcessors; i++) {
        cpuIdle += (info.processors[i].usage.idle - cpuInfo0.processors[i].usage.idle) /
                   (info.processors[i].usage.total - cpuInfo0.processors[i].usage.total) /
                    numOfProcessors;
      }
      cpuInfo0 = info;
      cpuIdleArray.push(cpuIdle);
      cpuIdleArray.shift();

      // Show CPU information on mouse over
      chrome.browserAction.setTitle({
        title: modelName + '\nUsage: ' + (100 - cpuIdle * 100).toFixed(0) + '%'
      });

      c.clearRect(0, 0, SIZE, SIZE);

      // Draw CPU usage change
      c.beginPath();
        c.moveTo(0, SIZE);
        for (var i = 0; i < SIZE; i++) {
          c.lineTo(i, cpuIdleArray[i] * SIZE);
        }
        c.lineTo(SIZE, SIZE);
        c.lineWidth = 2;
        c.fillStyle = '#4876ff';
        c.fill();

      // Draw border
      c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(0, SIZE);
        c.lineTo(SIZE, SIZE);
        c.lineTo(SIZE, 0);
        c.closePath();
        c.lineWidth = 2;
        c.strokeStyle = '#1874cd';
        c.stroke();

      chrome.browserAction.setIcon({
        imageData: c.getImageData(0, 0, SIZE, SIZE)
      });
    });
  }
})();