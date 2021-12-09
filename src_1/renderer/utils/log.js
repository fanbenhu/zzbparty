/*
 * @Author: Firen
 * @Date: 2021-12-05 16:13:57
 * @Github: https://github.com/firen-top
 * @Blog: https://firen.top
 * @LastEditTime: 2021-12-05 16:25:42
 * @Description: 
 */

import db from './db'
import logger from './logger'

export default  {
    write(log){
        console.log(log);
        const SQL = `INSERT INTO ADMIN_LOG (admin_id,log,status,create_time) VALUES(
            '${log.admin_id}',
            '${log.text}',
            '${log.status}',
            '${Date.now()}'
        )`;
        db.run(SQL, err => {
            logger(err)
        })
    }
}