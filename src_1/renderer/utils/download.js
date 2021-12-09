/*
 * @Author: Firen
 * @Date: 2021-12-05 14:42:11
 * @Github: https://github.com/firen-top
 * @Blog: https://firen.top
 * @LastEditTime: 2021-12-08 20:02:51
 * @Description: 
 */
import fs from 'fs'
import fse from 'fs-extra'
import xlsx from 'node-xlsx'
import path from 'path'
import os from 'os'
import day from 'dayjs'
import { ipcRenderer } from 'electron'
// import { ipcMain } from 'electron'
import logger from './logger'

const tmpPath = path.join(os.tmpdir(), 'lazzb')
fse.ensureDirSync(tmpPath)
/**
 * 导出excel
 * @param {String} filename 文件名
 * @param {Object} excelOption 表格配置([{name:<String>,data:<Array>}])
 * @return {Promise} 导出回调
 */
const excel = (filename, excelOption) => {
  return new Promise((resolve, reject) => {
    const buffer = xlsx.build(excelOption)
    console.log(buffer)
    const fileName = `${day().format('YYYY-MM-DD_HH-mm-ss')}_${filename}.xlsx`
    const filePath = path.join(tmpPath, fileName)
    logger('tmp:' + filePath)
    fs.writeFileSync(filePath, buffer)
    // fs.writeFile(filePath, buffer)
    console.log('right')
    // ipcMain.on('download', (event, filePath) => {
    //   mainWindow.webContents.downloadURL(filePath);// 这个时候会弹出让用户选择下载目录
    //   mainWindow.webContents.session.once('will-download', (event, item) => {
    //     item.once('done', (event, state) => {
    //       // 成功的话 state为completed 取消的话 state为cancelled
    //       mainWindow.webContents.send('downstate', state);
    //     });
    //   });
    // });


    ipcRenderer.send('download', filePath)
    console.log('right1')
    ipcRenderer.once('downstate', (event, arg) => {
      console.log('right2')
      console.log(arg)
      console.log(event)

      if (arg === 'completed' || arg === 'cancelled') {
        resolve(arg)
      } else {
        reject(arg)
      }
      fse.remove(filePath)
    })

    console.log('right3')
  })
}

export default {
  excel
}
