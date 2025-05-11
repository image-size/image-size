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