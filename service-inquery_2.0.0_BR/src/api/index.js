
import Env from './env';
import axios from 'axios'
import qs from 'querystring'

axios.defaults.withCredentials = true;
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';//配置请求头

//添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  //包含staff需单独处理，这个接口返回的数据
  if(config.url.indexOf('staff')!=-1){
    config.headers={
      'Content-Type':'application/x-www-form-urlencoded'
    }
  }
  return config;
}, function (error) {
  // Do something with request error
  // return Promise.reject(error);
});
// axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.common['x-requested-with'] = 'XMLHttpRequest'; //给后台区分异步请求
// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
if(response.config.url.indexOf('staff')!=-1){
  return response;
}
if(response.data && response.data.status && response.data.status!=302){
  //  let url=location.host.replace("mpf","");
  //  location.href="//mpf"+url+"/service/500"
  alert(response.data.desc);
  let url=location.host.replace("mpf","");
  location.href="//erm"+url;
}else if(response.data && response.data.status && response.data.status==302){ //未登录
  let url=location.host.replace("mpf","");
  location.href="//erm"+url
}

  return response;
}, function (error) {
  //   let url=location.host.replace("mpf","");
  //  location.href="//mpf"+url+"/service/500"
  alert('系统繁忙')
  // Do something with response error
  return Promise.reject(error);
});




//通用方法
export const POST = (url, params,contentType) => {
  if(!contentType) {
    return axios.post(`${url}`, params).then(res => res.data)
  }else {
    return axios.post(`${url}`, qs.parse(qs.stringify(params)), {
      headers: {
        'Content-Type': contentType
      },
    }).then(res => res.data)
  }
}

export const POSTS = (url, params) => {

    return axios.post(`${url}`, encodeURIComponent('body') + '=' + new Object(JSON.stringify(params))).then(res => res.data)

}
export const GETS = (url, params) => {

  return axios.get(`${url}`, encodeURIComponent('body') + '=' + new Object(JSON.stringify(params))).then(res => res.data)

}

export const GET = (url, params, contentType) => {
  if(!contentType) {
    return axios.get(`${url}`, {params: params}).then(res => res.data)
  }else {
    return axios.get(`${url}`,qs.stringify(params), {
      headers: {
        'Content-Type': contentType
      },
    }).then(res => res.data)
  }
}

export const PUT = (url, params) => {
  return axios.put(`${url}`, params).then(res => res.data)
}

export const DELETE = (url, params) => {
  return axios.delete(`${url}`, {params: params}).then(res => res.data)
}

export const PATCH = (url, params) => {
  return axios.patch(`${url}`, params).then(res => res.data)
}

