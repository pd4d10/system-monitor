import { once } from "lodash-es";

export const runOnceOnStartup = (fn: (...args: any) => any) => {
  const init = once(fn);

  // for manifest v3 startup
  // https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension
  chrome.runtime.onStartup.addListener(init);

  // for reload/enable
  init();
};
