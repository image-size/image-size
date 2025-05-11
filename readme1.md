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