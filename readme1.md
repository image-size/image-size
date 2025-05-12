<!--廖真余-->

## The main function of the warehouse is a Node.js module, which is used to detect the size (image dimensions) of an image. As can be seen from the description, it can help developers quickly obtain information such as the width and height of an image, which can be used in various application scenarios related to image processing.


## Basic function usage

### 1.Read the size from the image buffer in memory
applicable scene: When the image data comes from a network request or other non-file source.

operating steps:
1.Create a JavaScript file
2.Write the following code in the file:
```javascript
import { imageSize } from 'image-size';
import { readFileSync } from 'fs'; // Node.js Built-in module for reading files.

const buffer = readFileSync('D:\\photos\\13.png');

const dimensions = imageSize(buffer);

console.log(`图片宽度: ${dimensions.width}, 高度: ${dimensions.height}`);
```
3.Run the file in the terminal:node src/image.js

Screenshot of main function implementation：photos\shixian1

### 2. Read the image size from the local file
Handle local Promise

operating steps:
1.Create a JavaScript file
2.Write the following code in the file:
```javascript
import { imageSizeFromFile, setConcurrency } from 'image-size/fromFile';

async function run() {
    // Set the concurrency limit to 50
    setConcurrency(50);

    const dimensions = await imageSizeFromFile('D:\\photos\\11.jpg');
    console.log(`图片宽度：${dimensions.width}, 高度：${dimensions.height}`);
}
```

matters need attention: (1)Default is 100 files. (2)You can do it by method self setConcurrency
```javascript
import { setConcurrency } from 'image-size/fromFile';

setConcurrency(50); // Set the concurrency limit to 50
```
3.Run the file in the terminal:node src/index.js
Screenshot of main function implementation：photos\shixian2

### 3. Get the image size from the remote URL
If the image is stored, the HTTP request obtains the buffer data of the image and parses the size.

operating steps:
1.Create a JavaScript file
2.Write the following code in the file:
```javascript
const https = require('node:https'); // Replace with the https module.
const { imageSize } = require('image-size');

const imageUrl = 'https://pic.52112.com/2019/06/06/JPS-190606_155/24poJOgl7m_small.jpg';

https.get(imageUrl, (response) => { // attention https.get
    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const dimensions = imageSize(buffer);
        console.log(`图片宽度: ${dimensions.width}, 高度: ${dimensions.height}`);
    });
}).on('error', (error) => {
    console.error('请求出错:', error.message); // Handle network or permission issues.
});
```
3.Run the file in the terminal:node src/photos.js

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

operating steps:
Run the following command in the terminal:

```shell
npx image-size 11.jpg 13.png
```
Screenshot of main function implementation：photos\shixian4

### 3.Disable specific image formats
If you do not need to support certain image formats, you can disable them by configuring them.
```javascript
const { disableTypes, imageSize } = require('image-size');
const fs = require('fs');

disableTypes(['tiff', 'ico', 'svg']);

async function checkImages() {
    const imagePaths = [
        'D:\\photos\\11.jpg',   // Supported formats
        'D:\\photos\\svg.svg',        // Disabled formats
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

// Set the concurrency limit to 200
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

### 6.Read the image MIME type
The MIME type of the image can be obtained, which is useful for applications that need to know the image format

```javascript

import { imageSizeFromFile } from 'image-size/fromFile';

(async () => {
    try {
        const { type } = await imageSizeFromFile('D:/photos/11.jpg');
        console.log(`图片MIME类型: ${type}`);
    } catch (error) {
        console.error('读取图片MIME类型时出错:', error);
    }
})();
```
Screenshot of main function implementation：photos\shixian8

### 7.Get the size of the image file
```javascript
import { imageSizeFromFile } from 'image-size/fromFile';
import { stat } from 'node:fs/promises';

(async () => {
    try {
        const dimensions = await imageSizeFromFile('D:/photos/11.jpg');
        const { size } = await stat('D:/photos/11.jpg');

        console.log(`尺寸: ${dimensions.width}x${dimensions.height}`);
        console.log(`文件大小: ${size} 字节`);
    } catch (error) {
        console.error('读取图片信息时出错:', error);
    }
})();
```
Screenshot of main function implementation：photos\shixian9

### 8.Batch process all images in the directory

Use fs.readdir to traverse all the files in the directory and filter out the image files for processing

```javascript
import { imageSizeFromFile } from 'image-size/fromFile';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const directoryPath = 'D:/photos';

        const files = await readdir(directoryPath);

        for (const file of files) 
            const filePath = path.join(directoryPath, file);
            const ext = path.extname(file).toLowerCase();
```
Screenshot of main function implementation：photos\shixian10

### 9.Verify that the image size meets the requirements
Check that the image size meets the minimum / maximum width and height requirements

```javascript
import { imageSizeFromFile } from 'image-size/fromFile';

        const dimensions = await imageSizeFromFile('D:/photos/11.jpg');
        
        const MIN_WIDTH = 800;
        const MIN_HEIGHT = 600;
```
Screenshot of main function implementation：photos\shixian11


### 10.Calculate the aspect ratio of the image
Get the aspect ratio of the image, which is useful in situations where you need to maintain the image proportion

```javascript
import { imageSizeFromFile } from 'image-size/fromFile';

(async () => {
    try {
        const dimensions = await imageSizeFromFile('D:/photos/11.jpg');
        const aspectRatio = dimensions.width / dimensions.height;

        console.log(`宽高比: ${aspectRatio.toFixed(2)}:1`);
    } catch (error) {
        console.error('计算宽高比时出错:', error);
    }
})();
```
Screenshot of main function implementation：photos\shixian12



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