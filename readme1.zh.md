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
