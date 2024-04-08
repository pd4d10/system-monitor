declare namespace chrome.system.cpu {
  interface CpuInfo {
    // chromeos only, https://developer.chrome.com/docs/extensions/reference/system_cpu/#type-CpuInfo
    temperatures?: number[];
  }
}
