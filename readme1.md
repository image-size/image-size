## The main function of the warehouse is a Node.js module, which is used to detect the size (image dimensions) of an image. As can be seen from the description, it can help developers quickly obtain information such as the width and height of an image, which can be used in various application scenarios related to image processing.


## Basic function usage

### 1.Read the size from the image buffer in memory
applicable scene: When the image data comes from a network request or other non-file source.

```javascript
import { imageSize } from 'image-size';

const buffer = ...; // 假设此处已经获取了图片的缓冲区数据
const dimensions = imageSize(buffer);

console.log(`图片宽度: ${dimensions.width}, 高度: ${dimensions.height}`);
```
Screenshot of main function implementation：photos\shixian1

### 2. Read the image size from the local file
Handle local Promise

```javascript
import { imageSizeFromFile } from 'image-size/fromFile';

const dimensions = await imageSizeFromFile('photos/image.jpg');

console.log(`图片宽度: ${dimensions.width}, 高度: ${dimensions.height}`);
```

matters need attention: (1)Default is 100 files. (2)You can do it by method self setConcurrency
```javascript
import { setConcurrency } from 'image-size/fromFile';

setConcurrency(50); // 将并发限制调整为 50
```
Screenshot of main function implementation：photos\shixian2

### 3. Get the image size from the remote URL
If the image is stored, the HTTP request obtains the buffer data of the image and parses the size.
```javascript
import http from 'node:http';
import { imageSize } from 'image-size';

const imageUrl = 'http://example.com/image.jpg';

http.get(imageUrl, (response) => {
  const chunks = [];
  
  response.on('data', (chunk) => chunks.push(chunk));
  response.on('end', () => {
    const buffer = Buffer.concat(chunks);
    const dimensions = imageSize(buffer);

    console.log(`图片宽度: ${dimensions.width}, 高度: ${dimensions.height}`);
  });
});
```
Screenshot of main function implementation：photos\shixian3
## Advanced features

### 1.Process images of various sizes
note: For HEIF, ICO, or CUR files, width and height are the largest image's. All images' sizes can be found in the images array.

```javascript
import { imageSizeFromFile } from 'image-size/fromFile'
// or
const { imageSizeFromFile } = require('image-size/fromFile')

const { images } = await imageSizeFromFile('images/multi-size.ico')
for (const dimensions of images) {
  console.log(dimensions.width, dimensions.height)
}
```

### 2.Command line usage
For quick image size checks, you can use the command line tool.

```shell
npx image-size image1.jpg image2.png
```
Screenshot of main function implementation：photos\shixian4

### 3.Disable specific image formats
If you do not need to support certain image formats, you can disable them by configuring them.
```javascript
import { disableTypes } from 'image-size';

disableTypes(['tiff', 'ico']); // 禁用 TIFF 和 ICO 格式
```
Screenshot of main function implementation：photos\shixian5


### 4.Concurrency constraints
The default concurrency limit for reading files is 100. If you need to change this limit, you can use the setConcurrency function.

```javascript
const { imageSizeFromFile, setConcurrency } = require('image-size/fromFile');

// 设置并发限制为 200
setConcurrency(200);

async function testImageSize() {
    try {
        const dimensions = await imageSizeFromFile('path/to/your/image.jpg');
        console.log(`Width: ${dimensions.width}, Height: ${dimensions.height}`);
    } catch (error) {
        console.error('Error getting image dimensions:', error);
    }
}

testImageSize();
```
Screenshot of main function implementation：photos\shixian6

### 5.Detect the direction of the JPEG image
For JPEG images, you can get the direction defined in the EXIF (English) metadata.

```javascript
import { imageSizeFromFile } from 'image-size/fromFile';

const { width, height, orientation } = await imageSizeFromFile('photos/image.jpg');
console.log(`宽度: ${width}, 高度: ${height}, 方向: ${orientation}`);
```
Screenshot of main function implementation：photos\shixian7

# Use restrictions and precautions

1. **Partial file reading**
 only the header information of the image is read, and the size may still be returned for damaged files.
2. **SVG format:**
 only supports pixel size and viewBox, does not support percentage values.
3. **File access:**
 There are concurrency limits on file reading, which can be adjusted using setConcurrency.
4. **Buffer requirements:**
 Some formats (such as TIFF) require complete header information.
5. **Synchronous reading:**
 The synchronous API blocks the main thread and is not recommended.
6. **Disable type:**
 You can use disableTypes to disable specific image type processing.