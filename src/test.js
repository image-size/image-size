const { imageSizeFromFile, setConcurrency } = require('image-size/fromFile');

// 设置并发限制为 200
setConcurrency(200);

async function testImageSize() {
    try {
        const dimensions = await imageSizeFromFile('D:\\photos\\11.jpg');
        console.log(`Width: ${dimensions.width}, Height: ${dimensions.height}`);
    } catch (error) {
        console.error('Error getting image dimensions:', error);
    }
}

testImageSize();