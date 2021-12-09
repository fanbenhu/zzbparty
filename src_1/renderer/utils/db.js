import fse from 'fs-extra'
import path from 'path'
import sq3 from 'sqlite3'
import logger from './logger'
import { docDir } from './settings'
// 将数据存至系统用户目录，防止用户误删程序
export const dbPath = path.join(docDir, 'data.sqlite3')
fse.ensureFileSync(dbPath)

const sqlite3 = sq3.verbose()
const db = new sqlite3.Database(dbPath)
db.serialize(() => {
  /**
   * 党代表信息表 USER
   * id ID
   * name 姓名
   * card_id  身份证号
   * mobile  手机号
   * status 党代表状态  正常、停止、终止
   * type_id 党代表类型  省、市、县、乡
   * period_id 届次
   * sex 性别
   * birthday 生日
   * age 年龄
   * national 民族
   * native 籍贯
   * birth_place 出生地
   * jion_time  入党时间
   * regular_time  转正时间
   * work_time  参加工作时间
   * job  职业
   * health 健康状态
   * skill_job  专业技术职务
   * skill_specialty  专业专长
   * edu_full 全日制教育学历学位
   * edu_full_info  全日制毕业院校及专业
   * edu_after  在职教育学历
   * edu_after_info 在职教育毕业院校及专业
   * current_postion  当前职务
   * primary_party 基层党工委
   * small_text  简历
   * political_history  政治历史审核情况
   * rewards  奖惩情况
   * party_desc_current 本届党代表情况
   * party_desc_history 历届党代表情况
   * create_time  创建时间
   * update_time  修改时间
   */
  db.run(`CREATE TABLE USER (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL,
    card_id TEXT,
    mobile TEXT,
    status INTEGER,
    period_start INTEGER,
    period_end INTEGER,
    is_province_deputy INTEGER,
    province_deputy_period TEXT,
    is_city_deputy INTEGER,
    city_deputy_period TEXT,
    is_county_deputy INTEGER,
    county_deputy_period TEXT,
    is_township_deputy INTEGER,
    township_deputy_period TEXT,
    primary_party TEXT,
    primary_party_id INTEGER,
    create_time INTEGER,
    update_time INTEGER,
    more_keys TEXT
    )`, err => {
    logger(err)
  })

  /**
   * 自定义字段表  AUTO_FILEDS
   * table_name 表名
   * filed_name 字段名
   * data_type 数据类型
   * data_length 字段长度
   * data_input 登记方式
   * data_init  默认数据
   * is_count 是否统计百度分
   * base_filed 是不是系统字段
   * is_insert 是否已插入
   */
  db.run(`CREATE TABLE AUTO_FILEDS(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    table_name TEXT NOT NULL,
    filed_des VARCHAR(255),
    filed_name VARCHAR(255),
    data_type VARCHAR(255),
    data_length INTEGER,
    data_input VARCHAR(255),
    data_init VARCHAR(255),
    is_count  INTEGER,
    base_filed  INTEGER,
    is_insert INTEGER
    )`, err => {
    logger(err)
  })

  /**
   * 用户培训表 USER_TRAINING
   * id ID
   * user_id  USER_ID
   * train_time 培训时间
   * train_title 培训主题
   * train_desc 培训内容
   * create_time  创建时间
   * update_time  修改时间
   */
  db.run(`CREATE TABLE USER_TRAINING(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    user_id INTEGER NOT NULL,
    train_time VARCHAR(255),
    train_title VARCHAR(255),
    train_desc TEXT,
    create_time INTEGER NOT NULL,
    update_time INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USER(id)
    )`, err => {
    logger(err)
  })

  /**
   * 党代表议题情况 USER_ISSUE
   * id ID
   * user_id  USER_ID
   * issue_name 议题
   * issue_content  详细内容
   * issue_status 议题状态
   * create_time  创建时间
   * update_time  修改时间
   */
  db.run(`CREATE TABLE USER_ISSUE(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    user_id INTEGER NOT NULL,
    issue_name VARCHAR(255),
    issue_content TEXT,
    issue_status INTEGER default(0),
    create_time INTEGER NOT NULL,
    update_time INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USER(id)
    )`, err => {
    logger(err)
  })

  /**
   * 届次数据表 PERIOD
   * id ID
   * period_name  届次全称
   * period_small_name  届次简称
   * period_type  党代表类型  4省、3市、2县、1乡
   * start_time 开始时间
   * end_time 结束时间
   * remark 简介
   * create_time  创建时间
   * update_time  修改时间
   */
  db.run(`CREATE TABLE PERIOD(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    period_name VARCHAR(255) NOT NULL,
    period_small_name VARCHAR(255),
    period_type VARCHAR(255),
    start_time INTEGER NOT NULL,
    end_time INTEGER NOT NULL,
    remark VARCHAR(255),
    create_time INTEGER NOT NULL,
    update_time INTEGER NOT NULL
    )`, err => {
    logger(err)
  })
  /**
   * 学历管理
   */
   db.run(`CREATE TABLE EDU(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    edu_name VARCHAR(255) NOT NULL,
    create_time INTEGER NOT NULL,
    update_time INTEGER NOT NULL
    )`, err => {
    logger(err)
  })

  /**
   * 党工委  PARTY
   * ID
   * parent_id 父级党工委
   * party_name 名称
   * party_small_name 简称
   * party_desc 党工委介绍
   * create_time  创建时间
   * update_time  修改时间
   */
  db.run(`CREATE TABLE PARTY(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    parent_id INTEGER,
    party_name TEXT NOT NULL,
    party_small_name TEXT NOT NULL,
    party_desc VARCHAR(255) NOT NULL,
    party_level INTEGER,
    create_time INTEGER NOT NULL,
    update_time INTEGER NOT NULL
    )`, err => {
    logger(err)
  })

  /**
   * 操作日志 ADMIN
   * id   ID
   * admin_name  登陆账号
   * admin_pass  登陆密码
   * admin_level 账号等级
   * create_time 创建时间
   */
  db.run(`CREATE TABLE ADMIN(
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      admin_name TEXT NOT NULL,
      admin_pass TEXT NOT NULL,
      salt_key TEXT NOT NULL,
      mobile TEXT NOT NULL,
      admin_level INTEGER DEFAULT(0),
      party_id INTEGER DEFAULT(0),
      create_time INTEGER NOT NULL,
      update_time INTEGER NOT NULL
    )`, err => {
    logger(err)
  })

  /**
   * 操作日志 ADMINLOG
   * id   ID
   * log  内容
   * admin_id 操作人
   * create_time 创建时间
   */
  db.run(`CREATE TABLE ADMIN_LOG(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    admin_id INTEGER NOT NULL,
    status INTEGER,
    log TEXT,
    create_time INTEGER NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES ADMIN(id)
    )`, err => {
    logger(err)
  })

  db.run(`INSERT INTO ADMIN (id,admin_name,admin_pass,salt_key,mobile,admin_level,party_id,create_time,update_time) VALUES(1,'admin','d73df577e9d7f8869c3e1e71cb92176c','SywFu6HDRrBSWoVp','15255013894','','0','1638709986667',0)`,err => {
    logger(err)
  })

  db.run(`INSERT INTO EDU (edu_name,create_time,update_time) VALUES("初中",1638686231,0)`,err => {
    logger(err)
  })

  db.run(`INSERT INTO EDU (edu_name,create_time,update_time) VALUES("中专",1638686231,0)`,err => {
    logger(err)
  })

  db.run(`INSERT INTO EDU (edu_name,create_time,update_time) VALUES("高中",1638686231,0)`,err => {
    logger(err)
  })

  db.run(`INSERT INTO EDU (edu_name,create_time,update_time) VALUES("大专",1638686231,0)`,err => {
    logger(err)
  })

  db.run(`INSERT INTO EDU (edu_name,create_time,update_time) VALUES("本科",1638686231,0)`,err => {
    logger(err)
  })
  
  db.run(`INSERT INTO EDU (edu_name,create_time,update_time) VALUES("硕士研究生",1638686231,0)`,err => {
    logger(err)
  })
  db.run(`INSERT INTO EDU (edu_name,create_time,update_time) VALUES("博士研究生",1638686231,0)`,err => {
    logger(err)
  })
  db.run(`INSERT INTO EDU (edu_name,create_time,update_time) VALUES("其它",1638686231,0)`,err => {
    logger(err)
  })
})

export default db
