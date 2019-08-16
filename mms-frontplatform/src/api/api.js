import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

const API = class Api {
  get (url, params, cb) {
    return Vue.http.get(url, {params: params}).then((response) => {
      cb(response.body)
    }, function (response) {
    })
  }
  post (url, params, cb) {
    return Vue.http.post(url, {params: params, credentials: true}).then((response) => {
      cb(response.body)
    }, function (response) {
    })
  }
  jsonp (url, params, cb, cbName) {
    return Vue.http.jsonp(url, {params: params, jsonp: 'callback', jsonpCallback: cbName}).then((response) => {
      cb(response.body)
    }, function (response) {
    })
  }
  exportFile (url, params) {
    let paramUrl = ''
    for (var k in params) {
      let value = params[k] !== undefined ? params[k] : ''
      paramUrl += '&' + k + '=' + encodeURIComponent(value)
    }
    url += (url.indexOf('?') < 0 ? '?' : '&')
    url += paramUrl ? paramUrl.substring(1) : ''

    if (navigator.userAgent.indexOf('Chrome') > -1) {
      let link = document.createElement('a')
      link.href = url
      link.click()
    } else {
      window.open(url)
    }
  }
}

export default API
