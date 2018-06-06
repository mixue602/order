import Vue from 'vue'
import Router from 'vue-router'
import API from '../api/api_login';
import store from '../store/index';

Vue.use(Router);
// 懒加载方式，当路由被访问的时候才加载对应组件
const creatFiles_select = resolve => require(['@/components/creat-files/creatFiles_select'], resolve);
const creatFiles_detaile = resolve => require(['@/components/creat-files/creatFiles_detaile'], resolve);
const orderindex =resolve => require(['@/components/order-detaile/orderindex'],resolve);
const orderdetails =resolve => require(['@/components/order-detaile/orderdetails'],resolve);
const orderdetailsbeforesplit =resolve => require(['@/components/order-detaile/orderdetails-beforesplit'],resolve);
const orderPurchase_delate =resolve => require(['@/components/order-purchase/orderPurchase_delate'],resolve);
const orderPurchase_detail =resolve => require(['@/components/order-purchase/orderPurchase_detail'],resolve);
const orderPurchase_check =resolve => require(['@/components/order-purchase/orderPurchase_check'],resolve);
const account_unbundle = resolve => require(['@/components/account/account_unbundle'], resolve);
const demonstration = resolve => require(['@/components/demonstration'], resolve);

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/order/demonstration',
      name: 'demonstration',
      component: demonstration
    },
    {
      path: '/order/creatfileselect',
      name: 'creatFiles_select',
      component: creatFiles_select,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/order/creatfilesdetaile/:initCode?',
      name: 'creatFiles_detaile',
      component: creatFiles_detaile
    },
    {
      path: '/order/orderindex',
      name: 'orderindex',
      component: orderindex,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/order/orderdetails',
      name: 'orderdetails',
      component: orderdetails
    },
    {
      path: '/order/orderdetailsbeforesplit',
      name: 'orderdetailsbeforesplit',
      component: orderdetailsbeforesplit
    },
    {
      path: '/order/orderPurchase_delate',
      name: 'orderPurchase_delate',
      component: orderPurchase_delate
    },
    {
      path: '/order/orderPurchase_detail',
      name: 'orderPurchase_detail',
      component: orderPurchase_detail
    },
    {
      path: '/order/orderPurchase_check',
      name: 'orderPurchase_check',
      component: orderPurchase_check
    },
    {
     path: '/order/account/accountUnbundle',
      name: 'account_unbundle',
      component: account_unbundle
    },

  ]
})
 //登陆接口 在这验证
router.beforeEach((to, from, next) => {
  //console.log(to)
  let url=location.host.replace("mpf","");
  API.login({"url":to.name}).then(function (data) {
    if(data && data.success){
      if(data.response){ //权限赋值
        store.dispatch('setLogin',data.response);
      }
      next();
    }else if(data && !data.success && data.respMsg){ //登录接口异常
      alert('登录接口异常:'+data.respMsg)
    }
  })
})

export default router
