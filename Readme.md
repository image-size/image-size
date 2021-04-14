# view-image-size

A in-browser module to get dimensions (i.e. width, height, type) of an image file (by using a DataView)

## Supported formats

* BMP
* CUR
* DDS
* GIF
* ICNS
* ICO
* JPEG
* KTX
* PNG
* PNM (PAM, PBM, PFM, PGM, PPM)
* PSD
* SVG
* TIFF
* WebP

## Programmatic Usage

```shell
npm install view-image-size --save
```

### Synchronous

```javascript
const sizeOf = require('image-size')
const dimensions = sizeOf('images/funny-cats.png')
console.log(dimensions.width, dimensions.height)
```

### Asynchronous

```javascript
const sizeOf = require('image-size')
sizeOf('images/funny-cats.png', function (err, dimensions) {
  console.log(dimensions.width, dimensions.height)
})
```

NOTE: The asynchronous version doesn't work if the input is a Buffer. Use synchronous version instead.

Also, the asynchronous functions have a default concurreny limit of **100**
To change this limit, you can call the `setConcurrency` function like this:

```javascript
const sizeOf = require('image-size')
sizeOf.setConcurrency(123456)
```

### Using promises (nodejs 10.x+)

```javascript
const { promisify } = require('util')
const sizeOf = promisify(require('image-size'))
sizeOf('images/funny-cats.png')
  .then(dimensions => { console.log(dimensions.width, dimensions.height) })
  .catch(err => console.error(err))
```

### Async/Await (Typescript & ES7)

```javascript
const { promisify } = require('util')
const sizeOf = promisify(require('image-size'))
(async () => {
  try {
    const dimensions = await sizeOf('images/funny-cats.png')
    console.log(dimensions.width, dimensions.height)
  } catch (err) {
    console.error(err)
  }
})().then(c => console.log(c))
```

### Multi-size

If the target file is an icon (.ico) or a cursor (.cur), the `width` and `height` will be the ones of the first found image.

An additional `images` array is available and returns the dimensions of all the available images

```javascript
const sizeOf = require('image-size')
const images = sizeOf('images/multi-size.ico').images
for (const dimensions of images) {
  console.log(dimensions.width, dimensions.height)
}
```

### Using a URL

```javascript
const url = require('url')
const http = require('http')

const sizeOf = require('image-size')

const imgUrl = 'http://my-amazing-website.com/image.jpeg'
const options = url.parse(imgUrl)

http.get(options, function (response) {
  const chunks = []
  response.on('data', function (chunk) {
    chunks.push(chunk)
  }).on('end', function() {
    const buffer = Buffer.concat(chunks)
    console.log(sizeOf(buffer))
  })
})
```

You can optionally check the buffer lengths & stop downloading the image after a few kilobytes.
**You don't need to download the entire image**

### Disabling certain image types
```javascript
const imageSize = require('image-size')
imageSize.disableTypes(['tiff', 'ico'])
```

### Disabling all file-system reads
```javascript
const imageSize = require('image-size')
imageSize.disableFS(true)
```

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

## Hosted API

 We also provide a hosted API for image-size which may simplify your use case.

 <a href="https://image-size.saasify.sh">
 	<img src="https://badges.saasify.sh?text=View%20Hosted%20API" height="40"/>
 </a>

## Credits

not a direct port, but an attempt to have something like
[dabble's imagesize](https://github.com/dabble/imagesize/blob/master/lib/image_size.rb) as a node module.

## [Contributors](Contributors.md)
