<!--杨富惠-->
# Installation and Deployment Instructions for the image-size Project

## (I) Environment Preparation
### 1. Install Node.js
- **Reason**: The image-size project is developed based on Node.js. Node.js provides the basic environment for the project to run and is used to execute relevant JavaScript code.
- **Installation Steps**:
  - Visit the official Node.js website [https://nodejs.org/].
  - Download the .msi - suffix installation package for the Windows system according to the operating system.
  - Run the installation package and follow the wizard prompts. Keep the default settings until the installation is complete. After installation, enter `node -v` in the command - line (CMD). If the version number is displayed, it indicates a successful installation.

### 2. Install Git
- **Reason**: As a version control system, Git can be used to clone project code from GitHub to the local machine, facilitating code management and version tracking.
- **Installation Steps**:
  - Visit the official Git website [https://git-scm.com/].
  - Download the .exe - suffix installation package suitable for the Windows system.
  - Run the installation package. Keep most of the options as default. When selecting installation components, check according to your needs.
  - After the installation is completed, enter `git --version` in the command line. If the version information appears, it means the installation is successful.

## (II) Obtain Project Code
### 1. Fork the Project Repository (Operation on GitHub)
- **Purpose**: As a team member, fork the project repository that the team leader has forked to your own GitHub account to have an independent project copy and prevent affecting the original project and other team members' work.
- **Operation Process**:
  - Obtain the project repository link [https://github.com/xixi00124/image-size.git] from the team leader.
  - Log in to your personal GitHub account, visit the link in the browser, and enter the project repository page.
  - Click the [Fork] button in the upper - right corner of the page. In the pop - up window, select to fork the project to your own account, click Confirm, and wait for the project to be copied.

### 2. Clone the Project Repository to the Local Machine
- **Purpose**: Download the project code on GitHub to the local computer for local development, testing, and other work.
- **Operation Steps**:
  - Enter "cmd" in the newly created English homework folder to enter the command - line tool.
  - Copy the GitHub link of your forked project repository. Enter `git clone` in the command line, paste the link (`git clone https://github.com/chiyiko/image-size.git`), and press Enter to execute. Git will download the code to the current directory and generate an `image-size` folder.

## (III) Install Project Dependencies
- Enter the project directory and execute `cd image-size`.
- To install dependencies, as the project uses npm to manage dependencies, execute:
  ```bash
  npm install
  ```
- After the dependencies are installed, the project will generate a `node_modules` directory.

## (IV) Verify the Installation
- Check the project structure. The project contains the following key files:
  - `package.json`: Project configuration and dependency list.
  - `yarn.lock`: A file that locks the versions of dependencies.
  - `dist/` directory: Compiled code.
- Verify the command - line tool. After the installation is complete, you can use the `npx image-size` command to check the image size. For example:
  ```bash
  npx image-size "C:\Users\86138\Pictures\Lenovo Screenshots\Lenovo Screenshot_20230309191951.png"
  ```
  This command successfully outputs the image size information (such as 1481x790).

## Using the image-size Command - Line Tool
- For PNG images:
  ```bash
  npx image-size "C:\Users\86138\Pictures\Lenovo Screenshots\Lenovo Screenshot_20230309191951.png"
  ```
  Output: `1481x790 - C:\Users\86138\Pictures\Lenovo Screenshots\Lenovo Screenshot_20230309191951.png (png)`

- For another PNG image:
  ```bash
  npx image-size "C:\Users\86138\Pictures\Lenovo Screenshots\Lenovo Screenshot_20221222171254.png"
  ```
  Output: `1464x367 - C:\Users\86138\Pictures\Lenovo Screenshots\Lenovo Screenshot_20221222171254.png (png)`

- For SVG images:
  ```bash
  npx image-size "C:\Users\86138\Desktop\Background.svg"
  ```
  Output: `1280x1280 - C:\Users\86138\Desktop\Background.svg (svg)`

- For GIF images:
  ```bash
  npx image-size "C:\Users\86138\Desktop\3DEEDD2D7AEE216F97911D4219E5DAEF.gif"
  ```
  Output: `1310x1280 - C:\Users\86138\Desktop\3DEEDD2D7AEE216F97911D4219E5DAEF.gif (gif)`

These commands demonstrate how to use the image-size tool to obtain the size information of locally stored image files. 
<!--杨富惠-->