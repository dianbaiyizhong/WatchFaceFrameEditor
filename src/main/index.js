import {app, shell, BrowserWindow, ipcMain} from 'electron'

import {join, resolve} from 'path'
import {electronApp, optimizer, is} from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import AdmZip from "adm-zip";

const fs = require('fs');
const path = require('path');
const http = require('http');

// 获取应用数据目录（自动适配系统）
// const appDataPath = app.getPath('userData');
const appDataPath = "/Users/huanghaoming/Downloads/tmp"
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true, ...(process.platform === 'linux' ? {icon} : {}),
        nodeIntegration: true, contextIsolation: false,
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })


    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return {action: 'deny'}
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }


    const express = require('express');
    const app = express();
    const port = 2408;
    app.get('/', (req, res) => {
        const imgPath = req.query.img; // 替换为你的图片路径
        // 读取图片文件
        fs.readFile(imgPath, (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                return res.end("image not found");
            }
            // 返回图片数据
            res.writeHead(200, {'Content-Type': 'image/png'}); // 根据实际图片类型调整
            res.end(data);
        });
    });
    app.listen(port, () => {

    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')


    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    // IPC test
    ipcMain.on('ping', () => console.log('pong'))


    ipcMain.on('save-file', async (event, {fileName, fileData}) => {
        try {
            // 拼接保存路径
            const savePath = path.join(appDataPath, fileName);

            // 写入文件
            await fs.promises.writeFile(savePath, fileData);

            resolveApk(savePath, appDataPath)

            // 返回成功
            event.reply('save-file-reply', {
                success: true, savedPath: savePath
            });
        } catch (err) {
            // 返回错误
            event.reply('save-file-reply', {
                success: false, error: err.message
            });
        }
    });


    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})


function findImageResources(obj) {
    let sequenceImagesGroups = [];

    function recurse(currentObj) {
        for (let key in currentObj) {
            if (currentObj.hasOwnProperty(key)) {
                if (key === 'SequenceImages') {
                    // 如果找到 SequenceImages, 则处理其下的 Image 标签
                    const imagesGroup = [];
                    const images = currentObj[key];
                    images.forEach(imageGroup => {
                        if (Array.isArray(imageGroup.Image)) {
                            imageGroup.Image.forEach(image => {
                                if (image.$ && image.$.resource) {
                                    imagesGroup.push(image.$.resource);
                                }
                            });
                        }
                    });
                    if (imagesGroup.length > 0) {
                        sequenceImagesGroups.push(imagesGroup);
                    }
                } else if (typeof currentObj[key] === 'object') {
                    // 递归处理子对象
                    recurse(currentObj[key]);
                }
            }
        }
    }

    recurse(obj);
    return sequenceImagesGroups;
}


function resolveApk(filePath, outputDir) {
    // 获取文件名，去掉后缀
    const fileName = path.basename(filePath, path.extname(filePath));
    try {
        // 确保路径是绝对路径
        const absolutePath = resolve(filePath);

        const zip = new AdmZip(filePath)
        zip.extractAllTo(path.join(outputDir, fileName), true) // true 表示覆盖现有文件

        // 读取解压后的raw/watchface.xml文件，并获取所有的<SequenceImages>标签下面所有的<Image>标签的resource属性，得到数组
        const xmlPath = path.join(outputDir, fileName, 'res', 'raw', 'watchface.xml');
        const xmlContent = fs.readFileSync(xmlPath, 'utf-8');

        // xml2js 解析xml，将<SequenceImages>标签下面所有的<Image>标签的resource属性，得到数组
        const xml2js = require('xml2js');
        const parser = new xml2js.Parser();
        xml2js.parseString(xmlContent, (err, result) => {
            if (err) {
                throw err;
            }
            const imageResources = findImageResources(result);

            mainWindow.webContents.send('loadImages', findFilesByBaseNames(outputDir, imageResources[0]));
        });


    } catch (err) {
        console.error(`Error reading or parsing JSON file: ${err.message}`);
        throw err; // 或者返回 null 或默认值
    }
}

// nodejs 定义一个方法，入参是路径，文件名数组不包含后缀，请遍历递归目录找到文件，返回路径集合
function findFilesByBaseNames(dir, targetFileNames) {
    let results = [];

    // 同步读取目录内容
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // 如果是目录，递归查找
            results = results.concat(findFilesByBaseNames(fullPath, targetFileNames));
        } else {
            // 如果是文件，检查文件名是否匹配（忽略后缀）
            const baseName = path.basename(file, path.extname(file)); // 获取不带后缀的文件名
            if (targetFileNames.includes(baseName)) {
                results.push(fullPath);
            }
        }
    }

    return results;
}


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
