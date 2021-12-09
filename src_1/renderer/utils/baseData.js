/*
 * @Author: Firen
 * @Date: 2021-12-01 02:20:58
 * @Github: https://github.com/firen-top
 * @Blog: https://firen.top
 * @LastEditTime: 2021-12-08 15:32:23
 * @Description: 
 */
const filters = require('./filters').default 
export default  {
    periodList: [
        {
            period_name: '第十九届',
            id: '3'
        },
        {
            period_name: '第十八届',
            id: '2'
        },
        {
            period_name: '第十七届',
            id: '1'
        }
    ],
    typeList: [
        {
            type_name: '省级',
            id: '4'
        },
        {
            type_name: '市级',
            id: '3'
        },
        {
            type_name: '县级',
            id: '2'
        },
        {
            type_name: '乡级',
            id: '1'
        }
    ],
    statusList : [
        {
            label: '正常',
            value: '0'
        },
        {
            label: '停止',
            value: '1'
        },
        {
            label: '终止',
            value: '2'
        }
    ],
    eduList : [
        {label : "小学"},
        {label : "初中"},
        {label : "高中"},
        {label : "专科"},
        {label : "本科"},
        {label : "研究生"},
        {label : "博士生"},
        {label : "博士后"},
        {label : "其它"}
    ],
    settingItems : [
        {
            label : "届次",
            db_name : 'period',
            icon : 'md-albums',
            color : '#2db7f5'
        },
        {
            label : "党工委",
            db_name : 'party',
            icon : 'ios-paper-plane',
            color : '#ed4014',
            order : 'id asc'
        },
        {
            label : "议题",
            db_name : 'user_issue',
            icon : 'md-paper',
            color : '#ff9900'
        },
        {
            label : "培训",
            db_name : 'user_training',
            icon : 'ios-briefcase',
            color : '#19be6b'
        },
        // {
        //     label : "学历",
        //     db_name : 'edu',
        //     icon : 'md-school',
        //     color : '#2d8cf0'
        // }
    ],
    //高级设置
    hSettingItems : [
     
      {
          label : "管理员",
          db_name : 'admin',
          icon : 'ios-people',
          color : '#5cadff',
          order : 'id asc'
          
      },
      {
          label : "用户字段",
          db_name : 'auto_fileds',
          icon : 'md-barcode',
          color : '#2d8cf0',
          order : 'id asc'
      },
    //   {
    //       label : "操作日志",
    //       db_name : 'admin_log',
    //       icon : 'ios-bug',
    //       color : '#2d8cf0',
    //       order : 'id asc'
    //   }
    ],

    //初始化基本数据
    initDB :[ 
        `INSERT INTO PARTY (id,parent_id,party_name,party_small_name,party_desc,party_level,create_time,update_time) VALUES(1,0,'中共来安县直属机关工作委员会','来安县直工委','',1,1638686231,0)`,
          `INSERT INTO PARTY (id,parent_id,party_name,party_small_name,party_desc,party_level,create_time,update_time) VALUES(2,1,'来安县杨郢乡党工委','杨郢乡党工委','',2,1638686231,0)`,
          `INSERT INTO PARTY (id,parent_id,party_name,party_small_name,party_desc,party_level,create_time,update_time) VALUES(3,1,'来安县磁山乡党工委','磁山乡党工委','',2,1638686231,0)`,    

        
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(1,'USER','姓名','name','TEXT','','','','',1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(2,'USER','身份证号','card_id','TEXT','','','','',1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(3,'USER','手机号','mobile','INTEGER','','','','',1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(4,'USER','党代表状态','status','INTEGER','','select','正常,停止,终止',1,1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(5,'USER','本届起始时间','period_start','INTEGER','','date','',1,1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(6,'USER','本届结束时间','period_end','INTEGER','','date','',1,1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(7,'USER','省党代表','is_province_deputy','INTEGER','','select','是,否',1,1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(8,'USER','省代届次','province_deputy_period','TEXT','','select','',1,1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(9,'USER','市党代表','is_city_deputy','INTEGER','','select','是,否',1,1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(10,'USER','市代届次','city_deputy_period','TEXT','','select','',1,1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(11,'USER','县党代表','is_county_deputy','INTEGER','','select','是,否',1,1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(12,'USER','县代届次','county_deputy_period','TEXT','','select','',1,1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(13,'USER','乡党代表','is_township_deputy','INTEGER','','select','是,否',1,1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(14,'USER','乡代届次','township_deputy_period','TEXT','','select','',1,1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(15,'USER','基层党工委','primary_party','TEXT','','select','',0,1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(16,'USER','党工委ID','primary_party_id','INTEGER','','select','',1,1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(17,'USER','创建时间','create_time','INTEGER','','date','','',1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(18,'USER','修改时间','update_time','INTEGER','','date','','',1,1)`,
        `INSERT INTO AUTO_FILEDS (id,table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES(19,'USER','综合拓展','more_keys','TEXT','','','',0,1,1)`,

        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','性别','gender','TEXT','','select','男,女',1,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','年龄','age','INTEGER','','','','',0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','生日','birthday','TEXT','','date','','',0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','民族','national','TEXT','','','',1,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','籍贯','native','TEXT','','','','',0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','出生地','birth_place','TEXT','','','',0,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','入党时间','jion_time','TEXT','','date','',0,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','转正时间','regular_time','TEXT','date','','',0,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','参加工作时间','work_time','TEXT','','date','',0,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','职业','job','TEXT','','','',0,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','健康状态','health','TEXT','','','',0,0,0)`,

        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','专业技术职务','skill_job','TEXT','','','',0,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','专业专长','skill_specialty','','TEXT','','',0,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','全日制教育学历学位','edu_full','TEXT','','select','',0,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','全日制毕业院校及专业','edu_full_info','TEXT','','','',0,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','在职教育学历','edu_after','TEXT','','select','',0,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','在职教育毕业院校及专业','edu_after_info','TEXT','','','',0,0,0)`,

        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','当前职务','current_postion','TEXT','','','',0,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','简历','small_text','TEXT','','','',0,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','政治历史审核情况','political_history','TEXT','','','',0,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','奖惩情况','rewards','TEXT','','','',0,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','本届党代表情况','party_desc_current','TEXT','','','',0,0,0)`,
        `INSERT INTO AUTO_FILEDS (table_name,filed_des,filed_name,data_type,data_length,data_input,data_init,is_count,base_filed,is_insert) VALUES('USER','历届党代表情况','party_desc_history','TEXT','','','',0,0,0)`,
        
    ],
    
    sortList : [
        {
            label: '按年龄排序',
            value: 'DESC'
        },
        {
            label: '按',
            value: 'ASC'
        }
    ]

}