项目介绍(中文版)--谢婉莹

本仓库聚焦于一个专为检测图像尺寸而设计的Node.js模块。该模块具有零依赖和支持多种格式等显著优势，在实际开发场景中展现出广泛的适用性。核心内容如下：

1. 功能特性
多格式兼容与零依赖优势：此模块不依赖额外的库，能够无缝处理BMP、GIF、JPEG和PNG等常见图像格式，还支持HEIC和JPEG-XL等新兴格式。这种广泛的兼容性完全满足各种场景下的图像尺寸检测需求。
灵活多样的处理方式：它支持多种数据处理方法，可以对内存中的Buffer或Uint8Array数据进行操作，特别适合处理流数据和网络请求数据。它还可以直接读取本地文件以获取图像尺寸，或者从URL获取并处理图像数据。此外，在读取图像时，只需读取图像头部信息，有效减少了内存使用。
模块化设计与类型支持：该模块同时兼容ESM和CommonJS模块化规范，能容易适应不同的项目结构。另外，它提供了TypeScript类型定义，有助于在TypeScript项目中高效开发，提高代码的可读性和可维护性。

2. 使用方法
 基于Buffer的处理：使用`imageSize`函数并传入Buffer数据，可快速获取图像尺寸。这种方式适用于存储在内存中的图像数据或通过网络请求获取的数据。
文件读取：调用`imageSizeFromFile`函数可以从本地文件中读取图像尺寸。该函数返回一个Promise对象，你可以使用`await`方便获取结果。默认并发限制为100，你可以通过`setConcurrency`函数灵活调整并发数。
命令行使用：使用`npx image-size`命令，你可以快速检测图像文件的尺寸。这种简单快捷的方法适用于临时的图像尺寸检查。
支持多尺寸图像：对于HEIF、ICO和CUR等多尺寸图像，该模块可以获取最大图像的尺寸。你也可以通过`images`数组检索所有图像的尺寸信息。
从URL读取图像：结合`http`模块，从URL获取图像数据并转换为Buffer后，你可以使用`imageSize`函数获取尺寸，拓展了图像数据的获取方式。
禁用特定图像类型：通过`disableTypes`函数，你可以根据个性化需求禁用对特定图像类型（如'tiff'和'ico'）的检测。
处理JPEG图像方向信息：如果JPEG图像的EXIF元数据包含方向信息，使用`imageSizeFromFile`函数可以同时获取图像的宽度、高度和方向信息，增强了对JPEG图像的处理能力。

3. 局限性
由于这个模块只读取图像头部信息，因此对于一些损坏的图像，检测结果可能不准确。
对于SVG格式，仅支持像素尺寸和viewBox，不支持百分比值。
文件读取存在并发限制，并且某些格式要求Buffer数据的完整性。
<!--by 谢婉莹-->
 4. 许可证与维护
本项目根据MIT许可证发布，允许自由使用和修改。仓库中包含配置、测试和构建脚本，以确保项目的稳定性和持续改进。

5. 其他信息
本项目在MIT许可下发布，具有开源性质，允许免费使用和修改。仓库包含许多不同功能的文件，如配置、测试和构建文件，有效地确保了项目的正常运行和持续开发。
<!--by 谢婉莹-->



image-size项目的安装与部署指南(中文版)--谢婉莹

（一）环境准备
1. 安装 Node.js
原因：image-size项目是基于Node.js而进行开发的。Node.js为项目的运行提供了基础环境，是用于执行相关的JavaScript代码。
安装步骤：
访问Node.js的官方网站(https://nodejs.org/)。
根据所使用的Windows系统，下载后缀为.msi 的安装包。
运行该安装包，并按照安装指南的提示操作。在安装过程中一直保持默认设置，一直到安装完成。安装完成后，在命令提示符（CMD）中输入`node -v`。若可以显示出版本号，则表示安装成功。

2. 安装 Git
原因：Git作为一个版本控制系统，可以将项目代码从GitHub复制到本地计算机，方便进行代码管理和版本追踪。
安装步骤：
访问Git的官方网站 (https://git-scm.com/)。
下载适用于Windows系统的后缀为.exe的安装包。
运行安装包，大多选项一直保持默认。在选择安装组件时，可根据个人需求进行勾选。
安装完成后，在命令行中输入`git --version`。如果显示出版本信息，就说明安装已经成功。

（二）获取项目代码
1. Fork项目仓库（在GitHub上操作）
目的：作为团队成员，将团队负责人已Fork的项目仓库Fork到自己的GitHub账户中，这样就能拥有独立的项目副本，避免对原项目以及其他团队成员的工作造成影响。
操作流程：
从团队负责人处获取项目仓库的链接 (https://github.com/xixi00124/image-size.git)。
登录个人的GitHub账户，在浏览器中访问该链接，进入项目仓库页面。
点击页面右上角的[Fork] 按钮。在弹出的窗口中，选择将项目Fork到自己的账户，点击“确认”按钮，然后等待项目复制完成。

2. 将项目仓库克隆到本地计算机
目的：把GitHub上的项目代码下载到本地计算机，以便开始本地开发、测试等工作。
操作步骤：
在新创建的英文作业文件夹中，输入“cmd”以进入命令行工具。
复制你所Fork的项目仓库的GitHub链接。在命令行中输入`git clone`，然后粘贴链接（https://github.com/chiyiko/image-size.git），按下回车键执行。Git会将代码下载到当前目录，生成一个名为 `image-size` 的文件夹。
<!--by 谢婉莹-->

（三）安装项目依赖
进入项目目录，执行`cd image-size`。
由于项目是使用npm来管理依赖项的，需要安装依赖项，请执行以下操作：
npm install
依赖项安装完成后，项目会生成一个`node_modules`目录。

（四）验证安装
先检查项目的结构。这个项目包含以下关键文件：
package.json：记录着项目的配置信息以及依赖项列表。
yarn.lock：用于锁定依赖项版本的文件。
dist/目录：存放着已编译的代码。

验证命令行工具。安装完成后，你可以使用 `npx image-size` 命令来检查图像的尺寸。例如：
npx image-size "C:\Users\86138\Pictures\Lenovo Screenshots\Lenovo Screenshot_20230309191951.png"
  执行该命令后，会成功输出图像的尺寸信息（例如 1481x790）。

使用image-size命令行工具
对于PNG图像：
npx image-size "C:\Users\86138\Pictures\Lenovo Screenshots\Lenovo Screenshot_20230309191951.png"

输出：1481x790 - C:\Users\86138\Pictures\Lenovo Screenshots\Lenovo Screenshot_20230309191951.png (png)

对于另一张PNG图像：
npx image-size "C:\Users\86138\Pictures\Lenovo Screenshots\Lenovo Screenshot_20221222171254.png"

  输出：1464x367 - C:\Users\86138\Pictures\Lenovo Screenshots\Lenovo Screenshot_20221222171254.png (png)

对于SVG图像：
npx image-size "C:\Users\86138\Desktop\Background.svg"

  输出：1280x1280 - C:\Users\86138\Desktop\Background.svg (svg)

对于GIF图像：
npx image-size "C:\Users\86138\Desktop\3DEEDD2D7AEE216F97911D4219E5DAEF.gif"
 
  输出：1310x1280 - C:\Users\86138\Desktop\3DEEDD2D7AEE216F97911D4219E5DAEF.gif (gif)

以上这些命令展示了如何使用图像尺寸工具来获取本地存储的图像文件的尺寸信息。 
<!--by 谢婉莹-->

主要功能使用教程--中文 刘美和
## 这个仓库的主要功能是作为一个Node.js工具，专门用来检测图片的尺寸（也就是宽高）。开发人员可以用它快速获取图片的宽度和高度，这在处理图片相关的功能时非常有用，比如调整图片大小、验证图片格式等场景。

## 基础用法
###1. 从内存中的图片数据读取尺寸
适用场景：当图片数据来自网络下载或其他非文件来源时
操作步骤：
1. 新建一个JavaScript文件
2. 写入以下代码：
javascript
import { imageSize } from 'image-size';
import { readFileSync } from 'fs'; // Node.js自带的文件读取工具
 
const buffer = readFileSync('D:\\photos\\13.png');
 
const dimensions = imageSize(buffer);
 
console.log('图片宽度: ${dimensions.width}, 高度: ${dimensions.height}');
3. 在终端运行这个文件：node image.js
效果截图：photos\shixian1

###2. 直接读取本地图片文件
支持异步Promise写法
javascript
import { imageSizeFromFile, setConcurrency } from 'image-size/fromFile';
 
async function run() {
    setConcurrency(50);
 
    const dimensions = await imageSizeFromFile('D:\\photos\\11.jpg');
    console.log('图片宽度：${dimensions.width}, 高度：${dimensions.height}');
}
 
注意事项：(1)默认并发限制
默认情况下，同时处理的文件数为 100 个。
(2)可自定义并发数
你可以通过调用 setConcurrency 方法自行调整并发限制。
javascript
import { setConcurrency } from 'image-size/fromFile';
setConcurrency(50); // 改为同时处理50个
效果截图：photos\shixian2

###3. 从网络链接获取图片尺寸
如果图片在服务器上，可以通过网络请求下载图片数据后检测尺寸：
javascript
const https = require('node:https'); // 使用https模块
const { imageSize } = require('image-size');
 
const imageUrl = 'https://pic.52112.com/2019/06/06/JPS-190606_155/24poJOgl7m_small.jpg';
 
https.get(imageUrl, (response) => {
    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    response.on('end', () => {
        const buffer = Buffer.concat(chunks); 
        const dimensions = imageSize(buffer); 
        console.log('图片宽度: ${dimensions.width}, 高度: ${dimensions.height}');
    });
}).on('error', (error) => {
    console.error('请求失败:', error.message); // 处理网络问题
});
效果截图：photos\shixian3

##进阶功能
###1. 处理多尺寸图像文件
注意：像HEIF、ICO或CUR这类特殊格式，可能包含多个不同尺寸的图片。工具会返回最大图片的尺寸，所有尺寸信息可以在images数组里找到。
javascript
import { imageSizeFromFile } from 'image-size/fromFile'
// or
const { imageSizeFromFile } = require('image-size/fromFile')
 
const { images } = await imageSizeFromFile('images/multi-size.ico')
for (const dimensions of images) {
  console.log(dimensions.width, dimsensions.height) 
}

###2. 命令行快速检测
如果需快速检查图片尺寸，可以使用命令行工具。

shell
npx image-size 11.jpg 13.png 
效果截图：photos\shixian4

###3. 禁用不需要的格式
如果某些格式你不需要支持，可以手动关闭它们。
javascript
const { disableTypes, imageSize } = require('image-size');
const fs = require('fs');
 
disableTypes(['tiff', 'ico', 'svg']);
 
async function checkImages() {
    const imagePaths = [
        'D:\\photos\\11.jpg',   // 支持的格式
        'D:\\photos\\svg.svg',  // 已被禁用的格式
    ];
 
    for (const path of imagePaths) {
        try {
            const buffer = fs.readFileSync(path);
            const dimensions = imageSize(buffer);
            console.log('${path}: 尺寸=${dimensions.width}x${dimensions.height}');
        } catch (error) {
            console.error('${path}: 出错 - ${error.message}'); 
        }
    }
}
 
checkImages();
效果截图：photos\shixian5

###4. 控制同时处理的文件数
文件读取的默认并发限制为 100。如果需要调整此限制，可以使用 setConcurrency 函数。
javascript
const { imageSizeFromFile, setConcurrency } = require('image-size/fromFile');
 
// 改为同时处理200个文件
setConcurrency(200);
 
async function testImageSize() {
    try {
        const dimensions = await imageSizeFromFile('D:\\photos\\11.jpg');
        console.log('宽度: ${dimensions.width}, 高度: ${dimensions.height}');
    } catch (error) {
        console.error('获取尺寸失败:', error);
    }
}
 
testImageSize();
效果截图：photos\shixian6

###5. 检测JPEG方向信息
对于JPEG图片，可以读取EXIF元数据中的方向信息。
javascript
const { imageSizeFromFile } = require('image-size/fromFile');
 
async function getImageInfo() {
    try {
        const filePath = 'D:\\photos\\11.jpg';
        
        const { width, height, orientation } = await imageSizeFromFile(filePath);
        
        const direction = orientation
            ? '方向代码 ${orientation}'
            : '无方向信息（默认）';
 
        console.log('图片信息：');
        console.log('- 宽度: ${width}px');
        console.log('- 高度: ${height}px');
        console.log('- 方向: ${direction}');
    } catch (error) {
        console.error('错误：${error.message}');
    }
}
 
getImageInfo();
效果截图：photos\shixian7

###6. 获取图片MIME格式类型
可以获取图像的 MIME 类型，这对于需要知道图像格式的应用程序非常有用。
javascript
import { imageSizeFromFile } from 'image-size/fromFile';
 
(async () => {
    try {
        const { type } = await imageSizeFromFile('D:/photos/11.jpg');
        console.log('图片MIME类型: ${type}'); 
    } catch (error) {
        console.error('读取图片MIME类型时出错:',  error);
    }
})();
效果截图：photos\shixian8

###7. 获取图片文件大小
javascript
import { imageSizeFromFile } from 'image-size/fromFile';
import { stat } from 'node:fs/promises';
 
(async () => {
    try {
        const dimensions = await imageSizeFromFile('D:/photos/11.jpg');
        const { size } = await stat('D:/photos/11.jpg');
 
        console.log('尺寸: ${dimensions.width}x${dimensions.height}');
        console.log('文件大小: ${size} 字节');
    } catch (error) {
        console.error('读取图片信息失败:', error);
    }
})();
效果截图：photos\shixian9

###8. 批量处理文件夹中的所有图片
使用 fs.readdir 遍历目录中的所有文件，并筛选出图片文件进行处理。
javascript
import { imageSizeFromFile } from 'image-size/fromFile';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
 
const directoryPath = 'D:/photos'; 
 
const files = await readdir(directoryPath);
 
for (const file of files) 
    const filePath = path.join(directoryPath, file);
    const ext = path.extname(file).toLowerCase();

效果截图：见 photos\shixian10

###9. 检查图片尺寸是否达标
检查图片尺寸是否符合最小/最大宽度和高度要求。
javascript
import { imageSizeFromFile } from 'image-size/fromFile';
 
const dimensions = await imageSizeFromFile('D:/photos/11.jpg');
 
const MIN_WIDTH = 800;  
const MIN_HEIGHT = 600; 
 
效果截图：photos\shixian11

###10. 计算图片宽高比
获取图像的宽高比，这在需要保持图像比例的情况下很有用。
javascript
import { imageSizeFromFile } from 'image-size/fromFile';
 
(async () => {
    try {
        const dimensions = await imageSizeFromFile('D:/photos/11.jpg');
        const aspectRatio = dimensions.width / dimensions.height;
 
        console.log('宽高比: ${aspectRatio.toFixed(2)}:1');
    } catch (error) {
        console.error('计算宽高比失败:', error);
    }
})();
效果截图：photos\shixian12

## 使用限制和注意事项
1. 部分文件读取
仅读取图像的头部信息，对于损坏的文件可能仍会返回尺寸。
2. SVG格式
仅支持像素尺寸和 viewBox，不支持百分比值。
3. 文件访问
文件读取存在并发限制，可以使用 setConcurrency 进行调整。
4. 缓冲区要求
某些格式（如 TIFF）需要完整的头部信息。
5. 同步读取
同步 API 会阻塞主线程，不建议使用。
6. 禁用格式
可以使用 disableTypes 禁用特定图像格式的处理。

<!-- by 刘美和 -->
