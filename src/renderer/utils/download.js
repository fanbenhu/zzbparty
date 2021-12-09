/*
 * @Author: Firen
 * @Date: 2021-12-05 14:42:11
 * @Github: https://github.com/firen-top
 * @Blog: https://firen.top
 * @LastEditTime: 2021-12-08 23:26:44
 * @Description: 
 */
import fs from 'fs'
import fse from 'fs-extra'
import xlsx from 'node-xlsx'
import path from 'path'
import os from 'os'
import day from 'dayjs'
import { ipcRenderer } from 'electron'

import logger from './logger'
const excel = {};
const tmpPath = path.join(os.tmpdir(), 'lazzb')
fse.ensureDirSync(tmpPath)
/**
 * 导出excel
 * @param {String} filename 文件名
 * @param {Object} excelOption 表格配置([{name:<String>,data:<Array>}])
 * @return {Promise} 导出回调
 */
 
excel.output  = (filename, excelOption) => {
  return new Promise((resolve, reject) => {
    const buffer = xlsx.build(excelOption)
    const fileName = `${day().format('YYYY-MM-DD_HH-mm-ss')}_${filename}.xlsx`
    const filePath = path.join(tmpPath, fileName)
    logger('tmp:' + filePath)
    fs.writeFileSync(filePath, buffer,'',function(e){
      console.log(e)
    })
    ipcRenderer.send('download', filePath)

    ipcRenderer.once('downstate', (event, arg) => {
      if (arg === 'completed' || arg === 'cancelled') {
        resolve(arg)
      } else {
        reject(arg)
      }
      fse.remove(filePath)
    })
  })
}
excel.parse = (filePath) =>{
  return xlsx.parse(filePath);
}

export default {
  excel
}
