<!--杨富惠-->
# "image-size" Project Installation and Deployment Instructions

## (I) Environment Preparation

### 1. Install Node.js
- **Reason**: The "image-size" project is developed based on Node.js, which provides the basic environment for running the project and executing related JavaScript code.
- **Installation Steps**:
  - Visit the Node.js official website [https://nodejs.org/](https://nodejs.org/).
  - Download the installation package corresponding to your operating system.
  - Run the installation package and follow the prompts, keeping the default settings until the installation is complete. After installation, open the command line (e.g., cmd or PowerShell) and type `node -v`. If the version number is displayed, the installation is successful.

### 2. Install Git
- **Reason**: Git is a version control system that allows you to clone the project code from GitHub to your local machine, facilitating code management and version tracking.
- **Installation Steps**:
  - Visit the Git official website [https://git-scm.com/](https://git-scm.com/).
  - Download the installation package suitable for your operating system.
  - Run the installation package, keeping most options at their default settings. You can choose additional components as needed during the installation.
  - After the installation is complete, type `git --version` in the command line. If the version information appears, the installation is successful.

## (II) Obtain Project Code

### 1. Fork the Project Repository (on GitHub)
- **Purpose**: As a team member, you need to fork the project repository that your team leader has forked to your own GitHub account to have an independent copy of the project. This prevents affecting the original project and the work of other team members.
- **Procedure**:
  - Obtain the project repository link [https://github.com/xixi00124/image-size.git](https://github.com/xixi00124/image-size.git).
  - Log in to your personal GitHub account and visit the link in your browser to access the project repository page.
  - Click the **Fork** button in the upper right corner of the page. In the pop-up window, select your account to fork the project to, click **Confirm**, and wait for the project to be copied.

### 2. Clone the Project Repository to Your Local Machine
- **Purpose**: Download the project code from GitHub to your local computer to facilitate local development and testing.
- **Steps**:
  - Open a command line tool (Windows users can use cmd, PowerShell, or Git Bash).
  - Use the `cd` command to switch to the directory where you want to store the project code (e.g., `cd D:\code`; adjust the path according to your actual needs).
  - Copy the GitHub link of the project repository that you forked. In the command line, type `git clone`, paste the link (e.g., `git clone https://github.com/chiyiko/image-size.git`), and press Enter. Git will download the code to the current directory and create an `image-size` folder.

## (III) Install Project Dependencies
- Navigate to the project directory by executing `cd image-size`.
- Install dependencies. The project uses npm or yarn to manage dependencies. Execute:
  ```bash
  npm install
  ```
- After the dependencies are installed, the project will generate a `node_modules` directory.

## (IV) Verify Installation
- Check the project structure. The project includes the following key files:
  - `package.json`: The project configuration and dependency list.
  - `yarn.lock`: The file that locks the versions of the dependencies.
  - `dist/` directory: The compiled code.
- Verify the command-line tool. After installation, you can use the `npx image-size` command to check the dimensions of an image, for example:
  ```bash
  npx image-size "C:\Users\86138\Pictures\Screenshots\Screenshot_20230309191951.png"
  ```
  The command should successfully output the image dimensions (e.g., `1481x790`).

## Using the image-size Command-Line Tool

- For PNG images:
  ```bash
  npx image-size "C:\Users\86138\Pictures\Screenshots\Screenshot_20230309191951.png"
  ```
  Output: `1481x790 - C:\Users\86138\Pictures\Screenshots\Screenshot_20230309191951.png (png)`

- For another PNG image:
  ```bash
  npx image-size "C:\Users\86138\Pictures\Screenshots\Screenshot_20221222171254.png"
  ```
  Output: `1464x367 - C:\Users\86138\Pictures\Screenshots\Screenshot_20221222171254.png (png)`

- For SVG images:
  ```bash
  npx image-size "C:\Users\86138\Desktop\background.svg"
  ```
  Output: `1280x1280 - C:\Users\86138\Desktop\background.svg (svg)`

- For GIF images:
  ```bash
  npx image-size "C:\Users\86138\Desktop\3DEEDD2D7AEE216F97911D4219E5DAEF.gif"
  ```
  Output: `1310x1280 - C:\Users\86138\Desktop\3DEEDD2D7AEE216F97911D4219E5DAEF.gif (gif)`

These commands demonstrate how to use the image-size tool to obtain the size information of locally stored image files.

<!--杨富惠-->