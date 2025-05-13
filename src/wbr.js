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