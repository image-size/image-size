#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const fs = require('fs')
const path = require('path')
const { imageSize } = require('..')

const files = process.argv.slice(2)

if (!files.length) {
  console.error('Usage: image-size image1 [image2] [image3] ...')
  process.exit(-1)
}

const red = ['\x1B[31m', '\x1B[39m']
// const bold = ['\x1B[1m',  '\x1B[22m']
const grey = ['\x1B[90m', '\x1B[39m']
const green = ['\x1B[32m', '\x1B[39m']

function colorize(text, color) {
  return color[0] + text + color[1]
}

files.forEach(function (image) {
  try {
    if (fs.existsSync(path.resolve(image))) {
      const greyX = colorize('x', grey)
      const greyImage = colorize(image, grey)
      const result = imageSize(image)
      const sizes = result.images || [result]
      sizes.forEach((size) => {
        const type = size.type ?? result.type;
        const greyType = type ? colorize(` (${type})`, grey) : ''
        console.info(
          colorize(size.width, green) +
            greyX +
            colorize(size.height, green) +
            ' - ' +
            greyImage +
            greyType,
        )
      })
    } else {
      console.error("file doesn't exist - ", image)
    }
  } catch (e) {
    // console.error(e.stack)
    console.error(colorize(e.message, red), '-', image)
  }
})
