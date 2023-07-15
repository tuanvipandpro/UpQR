const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { createFolder, uploadFileToDrive } = require('./src/google.utils')
const https = require('https');
const prompt = require('electron-prompt');

const correctPassword = '123456';

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        resizable: false,
        maximizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    mainWindow.loadFile('index.html')
    // mainWindow.webContents.openDevTools();
}

ipcMain.handle('openFileSelectionDialog', async (event) => {
    const { dialog } = require('electron');

    const result = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
    });

    const folder = await createFolder("Test-1")

    result.filePaths.forEach(async (e) => {
        await uploadFileToDrive(e, folder.id)
    })

    return folder.webViewLink
});


app.whenReady().then(() => {
    const request = https.get('https://www.google.com', (response) => {
        prompt({
            title: 'Password',
            label: 'Password:',
            height: 180,
            width: 380,
            value: '',
            inputAttrs: {
                type: 'password'
            },
            type: 'input'
        })
        .then((r) => {
                if (r === correctPassword) {
                    createWindow()
                    app.on('activate', () => {
                        if (BrowserWindow.getAllWindows().length === 0) createWindow()
                    })
                }
        })
        request.on('error', (error) => {
            dialog.showMessageBox({
                type: 'error',
                title: 'Lỗi kết nối',
                message: 'Không có kết nối internet. Vui lòng kiểm tra lại.',
                buttons: ['OK'],
            }).then(() => app.quit())
        });
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})