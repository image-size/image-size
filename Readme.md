[![Dependency Status](https://gemnasium.com/netroy/image-size.png)](https://gemnasium.com/netroy/image-size)
[![NPM version](https://badge.fury.io/js/image-size.png)](https://npmjs.org/package/image-size)
[![Build Status](https://travis-ci.org/netroy/image-size.png?branch=master)](https://travis-ci.org/netroy/image-size)
[![Endorse](https://api.coderwall.com/netroy/endorsecount.png)](https://coderwall.com/netroy)

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

##### Upcoming
* TIFF
* WebP

##### Credits
not a direct port, but an attempt to have something like
[dabble's imagesize](https://github.com/dabble/imagesize/blob/master/lib/image_size.rb) as a node module.
