const { imageSizeFromFile } = require('image-size/fromFile');

async function getImageInfo() {
    try {
        // 替换为你的实际路径（直接复制资源管理器中的路径，自动转义双反斜杠）
        const filePath = 'D:\\photos\\11.jpg';

        // 获取图片尺寸和方向
        const { width, height, orientation } = await imageSizeFromFile(filePath);

        // 处理可能不存在的方向信息
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

// 执行异步函数
getImageInfo();