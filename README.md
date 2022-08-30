# Starter Project
A starter web project powered by webpack

## Instructions
After you clone or download this repository from GitHub, run the following to install required NPM packages. You only need to do this once.

```bash
npm install
```

Run the following to start the local development server:

```bash
npm start
```

Visit http://localhost:8080/ in your browser (Chrome and/or Firefox are recommended) to view your site. With the development server running, any change you make is compiled and seen automatically in the browser.

**NOTE**: All your HTML/CSS/Javascript code should go into the correct folders/files under the `src` folder and not under `dist` folder. 

When you are done with development and ready to deploy your application, run the following command:
project from `src` to `dist`:

```bash
npm run deploy
```

This command will compile your application into the `dist` folder. It's the contents of this folder that you upload to the weber server for final deployment.

## Troubleshooting
If you have issues installing this tool, please follow these instructions:

### Mac
```bash
npm install -g n
n 12.20.0
sudo npm install
```
Please, verify that you have the original package.json file.

Reference link: https://stackoverflow.com/questions/47008159/how-to-downgrade-node-version

### Windows
First, let's install nvm-windows: https://github.com/coreybutler/nvm-windows

```bash
nvm install 12.20.0
nvm use 12.20.0
npm install -g yarn
npm install
```
Please, verify that you have the original package.json file. If you are still having issues, please remove node_modules/ and packages-lock.json

# Acknowledgement
This project is originally based from Prof. PhD. Abdulmalek Al-Gahmi [CS 4280 Computer Graphics Course](https://github.com/WSU-FALL-2020/cs4280-inclass)
