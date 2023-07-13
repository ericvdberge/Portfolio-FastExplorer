const { app, BrowserWindow } = require('electron')
const path =  require('path')
const { pathToFileURL } = require('url');

/**
 * PreConfigure
 */

process.env.ELECTRON_DEV == 1 ? 
  process.env.ROOT = path.resolve(__dirname, '..') : //dev root folder 
  process.env.ROOT = path.join(process.resourcesPath) //production root folder 

// if(process.env.ELECTRON_DEV == 1) 
// {
  
//   process.env.ROOT = path.resolve(__dirname, '..')
// }
// else 
// {
//   //production root folder 
//   process.env.ROOT = path.join(process.resourcesPath)
// }


/**
 * Create function to run website in SSR
 */
const startWebServer = async () => {
  const modulePath = path.join(process.env.ROOT, '.output/server/index.mjs');
  const moduleUrl = pathToFileURL(modulePath).href;
  const { default: startServer } = await import(moduleUrl);

  if (typeof startServer === 'function') {
    startServer();
  }
}


/**
 * Create function to create window
 */
const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      }
    })
  
    win.loadURL('http://localhost:3000')
}

/**
 * Create function when app is ready
 */
app.whenReady()
  .then(startWebServer)
  .then(createWindow)

/**
 * Close the app when all windows are closed
 */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})




