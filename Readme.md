#### Work in progress
node module to detect dimentions of various supported image formats

[![NPM version](https://badge.fury.io/js/image-size.png)](https://npmjs.org/package/image-size)

[![Build Status](https://travis-ci.org/netroy/image-size.png?branch=master)](https://travis-ci.org/netroy/image-size)

#### Instalation

`npm install image-size`

#### Usage

```javascript
var sizeOf = require('image-size');
var dimesions = sizeOf('images/funny-cats.png');
console.log(dimesions.width, dimesions.height);
```

#### Supported formats
* BMP
* GIF
* JPEG
* PNG
* PSD

##### Upcoming
* TIFF
* WebP

##### Credits
not a direct port, but an attempt to have something like
[dabble's imagesize](https://github.com/dabble/imagesize/blob/master/lib/image_size.rb) as a node module.
