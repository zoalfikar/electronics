const { app, BrowserWindow } = require('electron')
const jfe = require("json-file-encrypt");
const path = require('path')
const fs = require("fs");
const { ipcMain } = require('electron');
const customerChecking = require('./customerChecking')
const mysqlServre = require('./runMysqlServer')
let key1 = new jfe.encryptor("there-in-no-way-to-find-out-what-is-the-secret-key");
var homaPagePath = '';
let win;
fs.readFile(path.join(__dirname, 'electronics.confige.txt'), 'utf8', async(error, data) => {
    if (error) {
        console.error(error);
        throw error;
    }
    let customer = await customerChecking.check()
    if (!customer) {
        console.log("not customer");
        process.exit()
    }
    var mysqlServerActive = await mysqlServre.run()
        // if (!mysqlServerActive) mysqlServerActive = await mysqlServre.run2()

    if (!mysqlServerActive) console.warn("start mysql server manually !");

    if (error) {
        console.error(error);

        throw error;
    }
    data = key1.decrypt(data.toString())

    const info = JSON.parse(data);

    let devMode = parseInt(info.devMode)

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
                preload: path.join(__dirname, 'preload.js'),
                devTools: devMode ? true : false,

            },
        })
        if (devMode) {
            win.webContents.openDevTools()
        }
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