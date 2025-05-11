<!--廖真余-->

## The main function of the warehouse is a Node.js module, which is used to detect the size (image dimensions) of an image. As can be seen from the description, it can help developers quickly obtain information such as the width and height of an image, which can be used in various application scenarios related to image processing.


## Basic function usage

### 1.Read the size from the image buffer in memory
applicable scene: When the image data comes from a network request or other non-file source.

```javascript
import { imageSize } from 'image-size';
import { readFileSync } from 'fs'; // Node.js 内置模块，用于读取文件

const buffer = readFileSync('D:\\photos\\13.png');

const dimensions = imageSize(buffer);

console.log(`图片宽度: ${dimensions.width}, 高度: ${dimensions.height}`);
```
Screenshot of main function implementation：photos\shixian1

### 2. Read the image size from the local file
Handle local Promise

```javascript
import { imageSizeFromFile, setConcurrency } from 'image-size/fromFile';

async function run() {
    // 设置并发限制为 50
    setConcurrency(50);

    const dimensions = await imageSizeFromFile('D:\\photos\\11.jpg');
    console.log(`图片宽度：${dimensions.width}, 高度：${dimensions.height}`);
}
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
const https = require('node:https'); // 替换为https模块
const { imageSize } = require('image-size');

const imageUrl = 'https://pic.52112.com/2019/06/06/JPS-190606_155/24poJOgl7m_small.jpg';

https.get(imageUrl, (response) => { // 注意https.get
    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const dimensions = imageSize(buffer);
        console.log(`图片宽度: ${dimensions.width}, 高度: ${dimensions.height}`);
    });
}).on('error', (error) => {
    console.error('请求出错:', error.message); // 处理网络或权限问题
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
npx image-size 11.jpg 13.png
```
Screenshot of main function implementation：photos\shixian4

### 3.Disable specific image formats
If you do not need to support certain image formats, you can disable them by configuring them.
```javascript
const { disableTypes, imageSize } = require('image-size');
const fs = require('fs');

// 禁用特定格式（可根据需要调整）
disableTypes(['tiff', 'ico', 'svg']);

async function checkImages() {
    const imagePaths = [
        'D:\\photos\\11.jpg',   // 支持的格式
        'D:\\photos\\svg.svg',        // 已禁用的格式
    ];

    for (const path of imagePaths) {
        try {
            const buffer = fs.readFileSync(path);
            const dimensions = imageSize(buffer);
            console.log(`${path}: 尺寸=${dimensions.width}x${dimensions.height}`);
        } catch (error) {
            console.error(`${path}: 错误 - ${error.message}`);
        }
    }
}

checkImages();
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
        const dimensions = await imageSizeFromFile('D:\\photos\\11.jpg');
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
const { imageSizeFromFile } = require('image-size/fromFile');

async function getImageInfo() {
    try {
        
        const filePath = 'D:\\photos\\11.jpg';

        
        const { width, height, orientation } = await imageSizeFromFile(filePath);

        
        const direction = orientation
            ? `方向代码 ${orientation}`
            : '无方向信息（默认）';

        console.log(`图片信息：`);
        console.log(`- 宽度: ${width}px`);
        console.log(`- 高度: ${height}px`);
        console.log(`- 方向: ${direction}`);
    } catch (error) {
        console.error(`错误：${error.message}`);
    }
}


getImageInfo();
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

 <!--廖真余-->