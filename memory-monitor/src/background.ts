import { runOnceOnStartup, setActionIcon } from "utils";

const data = Array(19).fill(1);

function draw() {
  chrome.system.memory.getInfo((info) => {
    data.push(info.availableCapacity / info.capacity);
    data.shift();

    chrome.action.setTitle({
      title: "Total: " + (info.capacity / 1073741824).toFixed(2) + " GiB\n"
        + "Available: " + (info.availableCapacity / 1073741824).toFixed(2) + " GiB",
    });

    setActionIcon(data, {
      color: "#66cdaa",
      borderColor: "#008744",
    });
  });

  setTimeout(draw, 1000);
}

runOnceOnStartup(draw);
