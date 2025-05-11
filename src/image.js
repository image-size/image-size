
import { imageSize } from 'image-size';
import { readFileSync } from 'fs'; // Node.js 内置模块，用于读取文件

// 读取本地图片文件为缓冲区
const buffer = readFileSync('D:\\photos\\13.png');

// 使用 image-size 获取图片尺寸
const dimensions = imageSize(buffer);

// 输出图片的宽度和高度
console.log(`图片宽度: ${dimensions.width}, 高度: ${dimensions.height}`);