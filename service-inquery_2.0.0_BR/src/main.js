// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import { Button ,Input} from 'element-ui'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/iconfont.css'
import Vgunit from 'vg-unit'
import 'vg-unit/theme-default/lib/index.css'

Vue.use(Vgunit)
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$ELEMENT = { size: 'small' };

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {App}
});
