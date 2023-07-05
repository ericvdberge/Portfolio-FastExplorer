const { app, BrowserWindow } = require('electron')
const path =  require('path')
var cp = require('child_process')


/**
 * PreConfigure
 */
process.env.ROOT = path.join(__dirname, '../../')
process.env.DIST = path.join(process.env.ROOT, 'src/dist')


/**
 * Create function to create window
 */
const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      }
    })
  
    const windowSrc = 'http://localhost:3000'
    win.loadURL(windowSrc)
}


/**
 * Create function when app is ready
 */
app.whenReady().then(() => {
    cp.fork(path.resolve(process.env.ROOT, 'src/.output/server/index.mjs'))
    createWindow()
})

/**
 * Close the app when all windows are closed
 */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})




