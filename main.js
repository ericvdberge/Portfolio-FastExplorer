const { app, BrowserWindow } = require('electron')
const path =  require('path')


/**
 * PreConfigure
 */
process.env.ROOT = path.join(__dirname)
process.env.DIST = path.join(process.env.ROOT, 'dist')


/**
 * Create function to create window
 */
const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    const windowSrc = path.join(process.env.DIST, 'index.html')
    win.loadFile(windowSrc)
}

/**
 * Create function when app is ready
 */
app.whenReady().then(() => {
    createWindow()
})

/**
 * Close the app when all windows are closed
 */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})




