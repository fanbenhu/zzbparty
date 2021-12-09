/*
 * @Author: Firen
 * @Date: 2021-12-05 14:42:11
 * @Github: https://github.com/firen-top
 * @Blog: https://firen.top
 * @LastEditTime: 2021-12-08 20:15:01
 * @Description: 
 */
/* eslint-disable camelcase */
import Vue from 'vue'

import VueRouter from 'vue-router'
import iView from 'iview'
import routes from './route'
import filters from './utils/util'
import db from './utils/db'
import adminLog from './utils/log'
import logger from './utils/logger'
import 'iview/dist/styles/iview.css'
// import './assets/less/common.less'
// import './utils/upgrade'

import store from './store'
// import VueParticles from 'vue-particles'


import App from './App'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

// Vue.use(VueParticles)yarn
Vue.use(VueRouter)

Vue.use(iView)
Object.keys(filters).forEach(k => Vue.filter(k, filters[ k ]))

const router = new VueRouter({
  routes
})
Vue.prototype.$db = db
Vue.prototype.$adminLog = adminLog

Vue.prototype.$logger = logger


/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')


// /* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   store,
//   render: h => h(App)
// })
