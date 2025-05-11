<!--杨富惠-->
**Installation and Deployment Guide for the image-size Project**

**I. Environment Preparation**

1. **Install Node.js**
   - **Reason**: The image-size project is developed based on Node.js, which provides the foundational environment for running the project and executing related JavaScript code.
   - **Installation Steps**:
     - Visit the official Node.js website at [https://nodejs.org/](https://nodejs.org/).
     - Download the installation package that corresponds to your operating system.
     - Run the installation package and follow the prompts, keeping the default settings until the installation is complete. After installation, open the command line (e.g., cmd or PowerShell) and type `node -v`. If the version number is displayed, the installation is successful.

2. **Install Git**
   - **Reason**: Git is a version control system that enables cloning of the project code from GitHub to your local machine, facilitating code management and version tracking.
   - **Installation Steps**:
     - Visit the official Git website at [https://git-scm.com/](https://git-scm.com/).
     - Download the installation package suitable for your operating system.
     - Run the installation package, keeping most options as default. You can select additional components as needed during the installation.
     - After the installation is complete, type `git --version` in the command line. If the version information appears, the installation is successful.

**II. Obtain Project Code**

1. **Fork the Project Repository (on GitHub)**
   - **Purpose**: As a team member, you need to fork the project repository that the team leader has forked to your own GitHub account to have an independent copy of the project. This prevents affecting the original project and the work of other team members.
   - **Operation Process**:
     - Obtain the project repository link from the team leader ([https://github.com/xixi00124/image-size.git](https://github.com/xixi00124/image-size.git)).
     - Log in to your personal GitHub account and visit the link in your browser to access the project repository page.
     - Click the **Fork** button in the upper right corner of the page. In the pop-up window, select to fork the project to your account and click **Confirm**. Wait for the project to be copied.

2. **Clone the Project Repository to Your Local Machine**
   - **Purpose**: Download the project code from GitHub to your local computer to facilitate local development, testing, and other tasks.
   - **Operation Steps**:
     - Open the command line tool (Windows users can use cmd, PowerShell, or Git Bash).
     - Use the `cd` command to switch to the directory where you want to store the project code (e.g., `cd D:\code`; adjust the path according to your actual needs).
     - Copy the GitHub link of the project repository that you forked. In the command line, type `git clone`, paste the link (e.g., `git clone https://github.com/chiyiko/image-size.git`), and press Enter. Git will download the code to the current directory and create an `image-size` folder.

**III. Install Project Dependencies**
   - Enter the project directory by executing `cd image-size`.
   - Install dependencies. The project uses npm or yarn to manage dependencies. Execute:
     ```bash
     npm install
     ```
   - After the dependencies are installed, the project will generate a `node_modules` directory.

**IV. Verify Installation**
   - **Check Project Structure**
     - The project includes the following key files:
       - `package.json`: The project configuration and dependency list.
       - `yarn.lock`: The file that locks the versions of the dependencies.
       - `dist/` directory: The compiled code.
   - **Verify Command-line Tool**
     - After installation, you can use the `npx image-size` command to check the dimensions of an image. For example:
       ```bash
       npx image-size "C:\Users\86138\Pictures\Screenshots\Screenshot_20230309191951.png"
       ```
     - The command successfully outputs the image dimensions (e.g., `1481x790`).
     <!--杨富惠-->