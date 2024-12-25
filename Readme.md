# image-size

[![Build Status](https://circleci.com/gh/image-size/image-size.svg?style=shield)](https://circleci.com/gh/image-size/image-size)
[![Package Version](https://img.shields.io/npm/v/image-size.svg)](https://www.npmjs.com/package/image-size)
[![Downloads](https://img.shields.io/npm/dm/image-size.svg)](http://npm-stat.com/charts.html?package=image-size&author=netroy&from=&to=)

A [Node](https://nodejs.org/en/) module to get dimensions of any image file

## Supported formats

- BMP
- CUR
- DDS
- GIF
- HEIC (HEIF, AVCI, AVIF)
- ICNS
- ICO
- J2C
- JPEG-2000 (JP2)
- JPEG
- JPEG-XL
- KTX (1 and 2)
- PNG
- PNM (PAM, PBM, PFM, PGM, PPM)
- PSD
- SVG
- TGA
- TIFF
- WebP

## Installation

```shell
npm install image-size --save
```

or

```shell
yarn add image-size
```

## Programmatic Usage

### Passing in a Buffer/Uint8Array

```javascript
import { imageSize } from 'image-size'
const { width, height } = imageSize(bufferObject)
console.log(width, height)
```

<details>
<summary>CommonJS</summary>

```javascript
const { imageSize } = require('image-size')
const { width, height } = imageSize(bufferObject)
console.log(width, height)
```

</details>

### Reading from a file

```javascript
import { imageSizeFromFile } from 'image-size/fromFile'
const dimensions = await imageSizeFromFile('images/funny-cats.png')
console.log(dimensions.width, dimensions.height)
```

<details>
<summary>CommonJS</summary>

```javascript
const { imageSizeFromFile } = require('image-size/fromFile')
const dimensions = await imageSizeFromFile('images/funny-cats.png')
console.log(dimensions.width, dimensions.height)
```

</details>

Note: Reading from files has a default concurrency limit of **100**
To change this limit, you can call the `setConcurrency` function like this:

```javascript
import { setConcurrency } from 'image-size/fromFile'
setConcurrency(123456)
```

<details>
<summary>CommonJS</summary>

```javascript
const { setConcurrency } = require('image-size/fromFile')
setConcurrency(123456)
```

</details>

### Multi-size

If the target file/buffer is an icon (.ico) or a cursor (.cur), the `width` and `height` will be the ones of the first found image.

An additional `images` array is available and returns the dimensions of all the available images

```javascript
import { imageSizeFromFile } from 'image-size/fromFile'
const { images } = await imageSizeFromFile('images/multi-size.ico')
for (const dimensions of images) {
  console.log(dimensions.width, dimensions.height)
}
```

<details>
<summary>CommonJS</summary>

```javascript
const { imageSizeFromFile } = require('image-size/fromFile')
const { images } = await imageSizeFromFile('images/multi-size.ico')
for (const dimensions of images) {
  console.log(dimensions.width, dimensions.height)
}
```

</details>

### Using a URL

```javascript
import url from 'node:url'
import http from 'node:http'
import { imageSize } from 'image-size'

const imgUrl = 'http://my-amazing-website.com/image.jpeg'
const options = url.parse(imgUrl)

http.get(options, function (response) {
  const chunks = []
  response
    .on('data', function (chunk) {
      chunks.push(chunk)
    })
    .on('end', function () {
      const buffer = Buffer.concat(chunks)
      console.log(imageSize(buffer))
    })
})
```

<details>
<summary>CommonJS</summary>

```javascript
const url = require('node:url')
const http = require('node:http')
const { imageSize } = require('image-size')

const imgUrl = 'http://my-amazing-website.com/image.jpeg'
const options = url.parse(imgUrl)

http.get(options, function (response) {
  const chunks = []
  response
    .on('data', function (chunk) {
      chunks.push(chunk)
    })
    .on('end', function () {
      const buffer = Buffer.concat(chunks)
      console.log(imageSize(buffer))
    })
})
```

</details>

You can optionally check the buffer lengths & stop downloading the image after a few kilobytes.
**You don't need to download the entire image**

### Disabling certain image types

```javascript
import { disableTypes } from 'image-size'
disableTypes(['tiff', 'ico'])
```

<details>
<summary>CommonJS</summary>

```javascript
const { disableTypes } = require('image-size')
disableTypes(['tiff', 'ico'])
```

</details>

### JPEG image orientation

If the orientation is present in the JPEG EXIF metadata, it will be returned by the function. The orientation value is a [number between 1 and 8](https://exiftool.org/TagNames/EXIF.html#:~:text=0x0112,8%20=%20Rotate%20270%20CW) representing a type of orientation.

```javascript
import { imageSizeFromFile } from 'image-size/fromFile'
const { width, height, orientation } = await imageSizeFromFile('images/photo.jpeg')
console.log(width, height, orientation)
```

<details>
<summary>CommonJS</summary>

```javascript
const { imageSizeFromFile } = require('image-size/fromFile')
const { width, height, orientation } = await imageSizeFromFile('images/photo.jpeg')
console.log(width, height, orientation)
```

</details>

## Command-Line Usage (CLI)

```shell
npm install image-size --global
```

or

```shell
yarn global add image-size
```

followed by

```shell
image-size image1 [image2] [image3] ...
```

## Credits

not a direct port, but an attempt to have something like
[dabble's imagesize](https://github.com/dabble/imagesize/blob/master/lib/image_size.rb) as a node module.

## [Contributors](Contributors.md)
