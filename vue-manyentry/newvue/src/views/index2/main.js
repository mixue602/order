import Vue from 'vue'
import App from '../index/App.vue'
import router from './router/index'
import store from '../../store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
