const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require("fs");
const { ipcMain } = require('electron');
const customerChecking = require('./customerChecking')
var homaPagePath = '';
let win;
fs.readFile(path.join(__dirname, 'electronics.json'), async(error, data) => {
    let customer = await customerChecking.check()
    if (!customer) {
        console.log("not customer");
        process.exit()
    }
    if (error) {
        console.error(error);

        throw error;
    }
    const info = JSON.parse(data);

    if (info.Initialized == "1") {
        homaPagePath = 'index.html';
    } else {
        homaPagePath = 'Initialization.html';
    }

    function createWindow() {
        win = new BrowserWindow({
            autoHideMenuBar: true,
            width: 1200,
            height: 720,
            minWidth: 1200,
            minHeight: 720,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload.js')
            },
        })
        win.webContents.openDevTools()
        win.loadFile(homaPagePath)

    }

    app.whenReady().then(() => {
        createWindow()

        ipcMain.on('change-web-content', (event, data) => {
            win.loadFile(data)
        });
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow()
            }
        })
    })


    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

});