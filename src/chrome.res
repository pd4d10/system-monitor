module BrowserAction = {
  type setTitleOptions = {title: string}

  @scope("chrome.browserAction")
  external setTitle: setTitleOptions => unit = "setTitle"

  type setIconOptions = {imageData: Webapi.Dom.Image.t}

  @scope("chrome.browserAction")
  external setIcon: setIconOptions => unit = "setIcon"
}
