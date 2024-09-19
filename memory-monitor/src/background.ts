import { runOnceOnStartup, setActionIcon } from "utils";

var SIZE = 19; // Icon size

// Define an array to storage available memory percent
var availMem = Array(SIZE);
for (var i = availMem.length; i--;) {
  availMem[i] = 1;
}

function draw() {
  // Get available memory percent
  chrome.system.memory.getInfo(function(info) {
    availMem.push(info.availableCapacity / info.capacity);
    availMem.shift();

    // Show memory information on mouse over
    chrome.action.setTitle({
      title: "Total: " + (info.capacity / 1073741824).toFixed(2) + " GiB\n"
        + "Available: " + (info.availableCapacity / 1073741824).toFixed(2) + " GiB",
    });

    setActionIcon(availMem, {
      color: "#66cdaa",
      borderColor: "#008744",
    });
  });

  setTimeout(draw, 1000);
}

runOnceOnStartup(draw);
