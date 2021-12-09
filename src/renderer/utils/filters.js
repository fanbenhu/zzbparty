import db from './db'
import log from './log'
export default {
    //格式化组织名称
    filter_party_name(item){
        let renderLine = "";
        let level = item.party_level;
        for(let i=0 ;i < level ; i++){
            renderLine += "--";
        }
        return "⏐" + renderLine + ' ' +  item.party_small_name
    },

    filter_admin_name(admin_id){
        // return admin_id;
        let admin_name = "未知"
        const SQL = `SELECT admin_name FROM ADMIN_LOG WHERE ADMIN_ID = ${admin_id}`;
        db.get(SQL, (err, res) => {
            if (!err) {
                admin_name = res.admin_name
            } 
        })
        return admin_name
    }
} 