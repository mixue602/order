import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import Echarts from 'echarts'
import store from './store/index'
import VueResource from 'vue-resource'
import RegionPicker from 'region-picker'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { mmsDomain } from 'api/config'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(VueResource)
Vue.use(RegionPicker)
Vue.prototype.$echarts = Echarts

Vue.http.interceptors.push((request, next) => { // 拦截器
  // request.method = 'POST'
  // 跨域携带cookie
  request.credentials = true
  next((response) => {
    if (response.body.success) {
      if (response.body.login !== undefined && !response.body.login) {
        window.location.href = mmsDomain.ermHome
      }
    }
    return response
  })
})

Vue.filter('time', function (value) {
  var d = new Date(value)
  var year = d.getFullYear()
  var month = d.getMonth() + 1
  var date = d.getDate()
  var hour = d.getHours()
  var minute = d.getMinutes()
  var second = d.getSeconds()

  function dbNum (val) {
    return val > 9 ? val : '0' + val
  }
  return year + '-' + dbNum(month) + '-' + dbNum(date) + ' ' + dbNum(hour) + ':' + dbNum(minute) + ':' + dbNum(second)
})

Vue.filter('mmtime', function (value) {
  var rVal = ''
  if (value !== '' && value !== undefined) {
    var time = parseInt(value)
    var d = new Date(time)
    var year = d.getFullYear()
    var month = d.getMonth() + 1
    var date = d.getDate()
    var hour = d.getHours()
    var minute = d.getMinutes()
    var second = d.getSeconds()
    rVal = year + '-' + dbNum(month) + '-' + dbNum(date) + ' ' + dbNum(hour) + ':' + dbNum(minute) + ':' + dbNum(second)
  }
  function dbNum (val) {
    return val > 9 ? val : '0' + val
  }
  return rVal
})

Vue.filter('time', function (value) {
  var d = new Date(value)
  var year = d.getFullYear()
  var month = d.getMonth() + 1
  var date = d.getDate()
  var hour = d.getHours()
  var minute = d.getMinutes()
  var second = d.getSeconds()

  function dbNum (val) {
    return val > 9 ? val : '0' + val
  }
  return year + '-' + dbNum(month) + '-' + dbNum(date) + ' ' + dbNum(hour) + ':' + dbNum(minute) + ':' + dbNum(second)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
