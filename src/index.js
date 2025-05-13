import { imageSizeFromFile, setConcurrency } from 'image-size/fromFile';

async function run() {
    // 设置并发限制为 50
    setConcurrency(50);

    const dimensions = await imageSizeFromFile('D:\\photos\\11.jpg');
    console.log(`图片宽度：${dimensions.width}, 高度：${dimensions.height}`);
}

run();