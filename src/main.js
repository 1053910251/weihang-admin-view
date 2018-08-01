// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'

Vue.use(Element, {
  size: 'medium' // set element-ui default size
})

Vue.config.productionTip = false

import './icons' // icon
import './errorLog' // err log

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
