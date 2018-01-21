const fs = require('fs')
const path = require('path')
const svg2png = require("svg2png")

const getDir = dir => path.resolve(__dirname, dir)

const file = fs.readFileSync(getDir('../src/icon.svg'))
svg2png(file).then(buffer => {
  fs.writeFile(getDir('../chrome/icon.png'), buffer)
})
