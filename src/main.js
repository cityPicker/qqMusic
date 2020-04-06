import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import store from './store'

import 'common/stylus/index.styl'
import VueLazyload from 'vue-lazyload'

// Vue.config.productionTip = false
fastclick.attach(document.body)

Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})

// 自动全局注册基础组件
const requireComponent = require.context(
  // 组件目录相对路径
  'base',
  // 是否查询子目录
  false,
  // 匹配文件名
  /_base-[\w-]+\.vue$/
)
console.log(requireComponent)
requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentsConfig = requireComponent(fileName)
  // 获取组件的PascalCase命名
  const componentName = fileName
    // 去掉./_
    .replace(/\.\/_/, '')
    // 去掉.vue
    .replace(/\.\w+$/, '')
    // 按 - 分隔
    .split('-')
    // 首字母大写
    .map(Kebab => { return Kebab.charAt(0).toUpperCase() + Kebab.slice(1) })
    // 组装成数组
    .join('')

  // 全局注册
  Vue.component(componentName, componentsConfig.default || componentsConfig)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
