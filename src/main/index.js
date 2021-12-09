/*
 * @Author: Firen
 * @Date: 2021-12-05 14:42:11
 * @Github: https://github.com/firen-top
 * @Blog: https://firen.top
 * @LastEditTime: 2021-12-08 20:48:18
 * @Description: 
 */
import { app, BrowserWindow } from 'electron'
const { ipcMain } = require('electron')
import '../renderer/store'
// const ipcMain = require('electron').ipcMain;

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
// // 加载好html再呈现window，避免白屏
// mainWindow.on('ready-to-show', () => {
//   mainWindow.show();
//   mainWindow.focus();
// });
// app.on('ready', createWindow)

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdatesAndNotify();
  // autoUpdater.checkForUpdatesAndNotify();
  createWindow();
});



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})




app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


/**
 * 边框
 */

// 窗口最小化
ipcMain.on('min-window', () => {
  mainWindow.minimize();
});
// 窗口最大化
ipcMain.on('max-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
});
// 关闭
ipcMain.on('close-window', () => {
  mainWindow.close();
});

/**
 * 导出下载
 */
ipcMain.on('download', (event, downloadPath) => {
  mainWindow.webContents.downloadURL(downloadPath);
  mainWindow.webContents.session.once('will-download', (event, item) => {
    
    item.once('done', (event, state) => {
      // 成功的话 state为completed 取消的话 state为cancelled
      mainWindow.webContents.send('downstate', state);
    });
  });
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
