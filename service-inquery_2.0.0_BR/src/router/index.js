import Vue from 'vue'
import Router from 'vue-router'
import API from '../api/api_login';
import store from '../store/index';
// 懒加载方式，当路由被访问的时候才加载对应组件
const serviceInquiry = resolve => require(['@/components/serviceInquiry/serviceInquiry'], resolve);
const agencyCounterDue = resolve => require(['@/components/agencyCounterDue/agencyCounterDue'], resolve);
const pushedList = resolve => require(['@/components/pushedList/pushedList'], resolve);
const allBack = resolve => require(['@/components/billHeader/allBack'], resolve);
const billing = resolve => require(['@/components/billing/billing'], resolve);
const billingpurchase = resolve => require(['@/components/billingpurchase/billingpurchase'], resolve);
const purchaseExtension = resolve => require(['@/components/purchaseExtension/purchaseExtension'], resolve);
const newComerGuide = resolve => require(['@/components/helpCenter/newComerGuide'], resolve);
const commonProblem = resolve => require(['@/components/helpCenter/commonProblem'], resolve);
const customerService = resolve => require(['@/components/helpCenter/customerService'], resolve);
const depositDouble = resolve => require(['@/components/depositDouble/depositDouble'], resolve);
const buyExtendedWarranty = resolve => require(['@/components/buyExtendedWarranty/buyExtendedWarranty'], resolve);
const fullDeposit = resolve => require(['@/components/fullDeposit/fullDeposit'], resolve);
const buyPoints = resolve => require(['@/components/buyPoints/buyPoints'], resolve);


const err404 = resolve => require(['@/components/error/404'], resolve);
const err500 = resolve => require(['@/components/error/500'], resolve);

Vue.use(Router)
let router = new Router({
  mode: 'history',
  routes: [{
      path: '/service/serviceInquiry',
      name: 'serviceInquiry',
      component: serviceInquiry
    },
    {
      path: '/service/agencyCounterDue',
      name: 'agencyCounterDue',
      component: agencyCounterDue
    },
    {
      path: '/service/pushedList',
      name: 'pushedList',
      component: pushedList
    },
    {
      path: '/service/allBack',
      name: 'allBack',
      component: allBack
    },
    {
      path: '/service/billing/:id?',
      name: 'billing',
      component: billing
    },
    {
      path: '/service/billingpurchase',
      name: 'billingpurchase',
      component: billingpurchase
    },
    {
      path: '/service/purchaseExtension',
      name: 'purchaseExtension',
      component: purchaseExtension
    },
    {
      path: '/service/helpCenter/newComerGuide',
      name: 'newComerGuide',
      component: newComerGuide
    },
    {
      path: '/service/helpCenter/commonProblem',
      name: 'commonProblem',
      component: commonProblem
    },
    {
      path: '/service/helpCenter/customerService',
      name: 'customerService',
      component: customerService
    },
    {
      path: '/service/depositDouble',
      name: 'depositDouble',
      component: depositDouble
    },
    {
      path: '/service/buyExtendedWarranty',
      name: 'buyExtendedWarranty',
      component: buyExtendedWarranty
    },
    {
      path: '/service/fullDeposit',
      name: 'fullDeposit',
      component: fullDeposit
    },
    {
      path: '/service/buyPoints',
      name: 'buyPoints',
      component: buyPoints
    },
    {
      path: '/service/500',
      name: 'err500',
      component: err500
    },
    {
      path: '/*',
      name: 'err404',
      component: err404
    }

  ]
})
//登陆接口 在这验证
router.beforeEach((to, from, next) => {
  if (to.name == "err404" || to.name == "err500") {
    next();
    return;
  }
  let url = location.host.replace("mpf", "");
  API.login({
    "url": to.name
  }).then(function (data) {
    if (data && data.success) {
      if (data.response) { //权限赋值
        store.dispatch('setLogin', data.response);
      }
      next();
    } else if (data && !data.success && data.respMsg) { //登录接口异常
      alert('登录接口异常:' + data.respMsg)
    }
  })
})
router.afterEach(route => {
  document.getElementById('appLoading').style.display = 'none'; //隐藏loading
})
export default router
