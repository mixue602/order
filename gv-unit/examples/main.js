// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import demoBlock from './components/demo-block.vue'
import router from './router'
import Gvunit from '../packages/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../packages/theme-default/lib/index.css'
Vue.component('demo-block', demoBlock)
Vue.config.productionTip = false
Vue.use(Gvunit)
Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
