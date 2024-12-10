const { app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const { exec } = require('child_process')
const fs = require('fs').promises
const os = require('os');

let myWindow
const createWindow = () => {
    myWindow = new BrowserWindow({
        width: 1500,
        backgroundColor: '#191a2a',
        height: 900,
        minHeight: 300,
        minWidth: 500,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        frame: false
    })

    myWindow.loadURL("http://localhost:5173")
}

app.whenReady().then(() => {
    createWindow()
})


ipcMain.on('window-action', (event, action) => {
    console.log('accion recibida',action, myWindow)
    //if (!myWindow) return
    switch (action) {
        case 'minimize':
            myWindow.minimize()
            break
        case 'maximize':
            myWindow.isMaximized() ? myWindow.unmaximize() : myWindow.maximize()
            break
        case 'close':
            app.quit()
            break
        default:
            break
    }
})

ipcMain.handle('execute-code', async (_,code) => {
    const res = await code
    if (!code.trim() && code !== '') {

        throw new Error('el codigo esta vacio')
    }
    
    const tempFilePath = path.join(__dirname, 'temp.js')

    try {

        await fs.writeFile(tempFilePath, res, 'utf8')
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                exec(`node "${tempFilePath}"`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(tempFilePath, 'direccion')
                        reject(stderr || error.message)
                    } else {
                        resolve(stdout || 'sin salida')
                    }
    
                    /* fs.unlink(tempFilePath).catch((deleteError) => console.error('error al eliminar el archivo')) */
                })
            }, 600);
        })
    } catch (error) {
        throw new Error(`error al escribir el archivo ${error.message}`)
    } /* finally {
        await fs.unlink(tempFilePath).catch(() => {})
    } */

})