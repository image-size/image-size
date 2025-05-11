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