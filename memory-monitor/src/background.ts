var SIZE = 19; // Icon size

const canvas = new OffscreenCanvas(SIZE, SIZE);
const c = canvas.getContext("2d", {
  // https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-will-read-frequently
  willReadFrequently: true,
})!;

// Define an array to storage available memory percent
var availMem = Array(SIZE);
for (var i = availMem.length; i--;) {
  availMem[i] = 1;
}

(function draw() {
  // Get available memory percent
  chrome.system.memory.getInfo(function(info) {
    availMem.push(info.availableCapacity / info.capacity);
    availMem.shift();

    // Show memory information on mouse over
    chrome.browserAction.setTitle({
      title: "Total: " + (info.capacity / 1073741824).toFixed(2) + " GiB\n"
        + "Available: " + (info.availableCapacity / 1073741824).toFixed(2) + " GiB",
    });

    c.clearRect(0, 0, SIZE, SIZE);

    // Draw memory usage change
    c.beginPath();
    c.moveTo(0, SIZE);
    for (var i = 0; i < SIZE; i++) {
      c.lineTo(i, availMem[i] * SIZE);
    }
    c.lineTo(SIZE, SIZE);
    c.lineWidth = 2;
    c.fillStyle = "#66cdaa";
    c.fill();

    // Draw border
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(0, SIZE);
    c.lineTo(SIZE, SIZE);
    c.lineTo(SIZE, 0);
    c.closePath();
    c.lineWidth = 2;
    c.strokeStyle = "#008744";
    c.stroke();

    chrome.browserAction.setIcon({
      imageData: c.getImageData(0, 0, SIZE, SIZE),
    });
  });

  setTimeout(draw, 1000);
})();
