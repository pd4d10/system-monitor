@module("./utils")
external getSystemInfo: 'a = "getSystemInfo"

module OffscreenCanvas = {
  type t
  @new external make: (float, float) => 'a = "OffscreenCanvas"
}

let size = 19
let sizef = size->Int.toFloat
let borderWidth = 2.

let canvas = OffscreenCanvas.make(sizef, sizef)
let ctx = canvas->Webapi.Canvas.CanvasElement.getContext2d

let clear = ctx => {
  open Webapi.Canvas.Canvas2d
  ctx->clearRect(~x=0., ~y=0., ~w=sizef, ~h=sizef)
}

let drawBackground = (ctx, color, arr) => {
  open Webapi.Canvas.Canvas2d
  ctx->beginPath
  ctx->moveTo(~x=0., ~y=sizef)
  arr->Array.forEachWithIndex((i, v) => {
    ctx->lineTo(~x=i->Int.toFloat, ~y=v *. sizef)
  })
  ctx->lineTo(~x=sizef, ~y=sizef)
  ctx->lineWidth(2.)
  ctx->setFillStyle(String, color)
  ctx->fill
}

let drawBorder = (ctx, color) => {
  open Webapi.Canvas.Canvas2d
  ctx->beginPath
  ctx->moveTo(~x=0., ~y=0.)
  ctx->lineTo(~x=0., ~y=sizef)
  ctx->lineTo(~x=sizef, ~y=sizef)
  ctx->lineTo(~x=sizef, ~y=0.)
  ctx->closePath
  ctx->lineWidth(borderWidth)
  ctx->setStrokeStyle(String, color)
  ctx->stroke
}

let cpuIdleArray = Array.make(size, 1.)

getSystemInfo(.{"cpu": true}, data => {
  let modelName = data["cpu"]["modelName"]
  let usage = data["cpu"]["usage"]

  let idle =
    usage->Array.reduce(0., (a, b) => a +. b["idle"] /. b["total"]) /.
      usage->Array.length->Int.toFloat

  let c = (100. *. (1. -. idle))->Js.Float.toFixed
  Chrome.BrowserAction.setTitle({
    title: `${modelName}\nUsage: ${c}%`,
  })

  cpuIdleArray->Array.push(idle)
  let _ = cpuIdleArray->Js.Array2.shift

  ctx->clear
  ctx->drawBackground("#4876ff", cpuIdleArray)
  ctx->drawBorder("#1874cd")

  Chrome.BrowserAction.setIcon({
    imageData: ctx->Webapi.Canvas.Canvas2d.getImageData(~sx=0., ~sy=0., ~sw=sizef, ~sh=sizef),
  })
})
