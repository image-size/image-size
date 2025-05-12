项目介绍（英文版） 梁飘月

This repository focuses on a Node.js module specifically designed for detecting image sizes. With notable advantages like zero dependencies and multi - format support, this module demonstrates broad applicability in actual development scenarios. The core content is as follows:

1. Functional Features  
Compatibility with Multiple Formats and Zero Dependency Advantage: This module does not rely on additional libraries. It can seamlessly handle common image formats such as BMP, GIF, JPEG, and PNG, and also supports emerging formats like HEIC and JPEG - XL. This extensive compatibility fully meets the needs of image size detection in various scenarios.  
Flexible and Diverse Processing Methods: It supports multiple data - processing approaches. It can operate on Buffer or Uint8Array data in memory, which is particularly suitable for handling streaming and network - request data. It can also directly read local files to get image sizes or acquire and process image data from URLs. Moreover, when reading images, it only needs to read the image headers, effectively reducing memory usage.  
Modular Design and Type Support: It is compatible with both ESM and CommonJS modular specifications, allowing easy adaptation to different project structures. Additionally, it provides TypeScript type definitions, which aids in efficient development within TypeScript projects and improves code readability and maintainability.  

2. Usage Methods  
Processing Based on Buffer: Use the `imageSize` function and pass Buffer data to quickly get the image size. This suits image data stored in memory or data obtained via network requests.  

File Reading: Call the `imageSizeFromFile` function to read an image’s size from a local file. This function returns a Promise object, and you can use `await` to conveniently get the result. The default concurrency limit is 100, and you can flexibly adjust the concurrency via the `setConcurrency` function.  

Command - Line Usage: With the `npx image - size` command, you can quickly detect an image file’s size. This simple and fast method is suitable for temporary image - size checks.  

Support for Multi - Size Images: For multi - size images like HEIF, ICO, and CUR, the module can get the size of the largest image. You can also retrieve all images’ size information through the `images` array.  

Reading Images from URLs: Combined with the `http` module, after obtaining image data from a URL and converting it to a Buffer, you can use the `imageSize` function to get the size, expanding image - data acquisition methods. 

Disabling Specific Image Types: Through the `disableTypes` function, you can disable detection for specific image types (such as 'tiff' and 'ico') per personalized needs.  

Processing of JPEG Image Orientation: If a JPEG image’s EXIF metadata contains orientation information, using the `imageSizeFromFile` function allows you to simultaneously obtain the image’s width, height, and orientation information, enhancing JPEG - image processing capabilities.  

3. Limitations  
It only reads the image header, so detection results for some damaged images may be inaccurate.  
For the SVG format, only pixel dimensions and viewBox are supported—percentage values are not.  
File reading has a concurrency limit, and some formats require Buffer - data integrity.  

4. License and Maintenance
This project is released under the MIT License, allowing free use and modification. The repository includes configuration, testing, and build scripts to ensure stability and continuous improvement.

5. Other Information  
This project is licensed under the MIT license, featuring open - source nature with free use and modification allowed. The repository contains numerous files for different functions like configuration, testing, and building, effectively ensuring the project’s normal operation and continuous development.  
#梁飘月