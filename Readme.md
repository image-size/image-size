[![Build Status](https://travis-ci.org/netroy/image-size.png?branch=master)](https://travis-ci.org/netroy/image-size)
[![Dependency Status](https://gemnasium.com/netroy/image-size.png)](https://gemnasium.com/netroy/image-size)
[![Technical debt analysis](https://www.sidekickjs.com/r/netroy/image-size/status_badge.svg)](https://www.sidekickjs.com/r/netroy/image-size)

#### Instalation

`npm install image-size`

#### Usage

```javascript
var sizeOf = require('image-size');
var dimensions = sizeOf('images/funny-cats.png');
console.log(dimensions.width, dimensions.height);
```

##### Async version
```javascript
var sizeOf = require('image-size');
sizeOf('images/funny-cats.png', function (err, dimensions) {
  console.log(dimensions.width, dimensions.height);
});
```

#### Supported formats
* BMP
* GIF
* JPEG
* PNG
* PSD
* TIFF

##### Upcoming
* WebP
* SVG
* SWF

##### Credits
not a direct port, but an attempt to have something like
[dabble's imagesize](https://github.com/dabble/imagesize/blob/master/lib/image_size.rb) as a node module.

##### [Contributors](Contributors.md)
