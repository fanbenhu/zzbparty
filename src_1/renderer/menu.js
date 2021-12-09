/*
 * @Author: Firen
 * @Date: 2021-12-01 03:55:44
 * @Github: https://github.com/firen-top
 * @Blog: https://firen.top
 * @LastEditTime: 2021-12-05 13:08:05
 * @Description: 
 */

import Users from './pages/menu/Users.vue'
import Base from './pages/menu/Base.vue'
import Setting from './pages/menu/Setting.vue'
import Hsetting from './pages/menu/Hsetting.vue'

const menu = [
  {
    icon: 'ios-home',
    title: '首页',
    path: '/base',
    component: Base
  },
  {
    icon: 'ios-person',
    title: '党代表管理',
    path: '/users',
    component: Users
  },
  {
    icon: 'ios-clock',
    title: '历史党代库',
    path: '/history',
    component: Users
  },
  {
    icon: 'ios-grid',
    title: '信息配置',
    path: '/setting',
    component: Setting
  },
  {
    icon: 'md-construct',
    title: '高级设置',
    path: '/hsetting',
    component: Hsetting
  }
  
]
export default menu
