
import { imageSize } from 'image-size';
import { readFileSync } from 'fs'; // Node.js 内置模块，用于读取文件

const buffer = readFileSync('D:\\photos\\13.png');

const dimensions = imageSize(buffer);

console.log(`图片宽度: ${dimensions.width}, 高度: ${dimensions.height}`);