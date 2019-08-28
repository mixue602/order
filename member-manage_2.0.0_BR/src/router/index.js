import Vue from 'vue'
import Router from 'vue-router'
import API from '../api/api_login';
import store from '../store/index';
// 懒加载方式，当路由被访问的时候才加载对应组件
const MemberQuery = resolve => require(['@/components/member_card/memberQuery'], resolve);
const MemberNewlyBuild = resolve => require(['@/components/member_card/memberNewlyBuild'], resolve);
const MemberDetails = resolve => require(['@/components/member_card/memberDetails'], resolve);
const MemberAddress = resolve => require(['@/components/member_address/memberAddress'], resolve);
const MemberBeanRecord = resolve => require(['@/components/member_resume/memberBeanRecord'], resolve);
const MemberOrderRecord = resolve => require(['@/components/member_resume/memberOrderRecord'], resolve);
const MemberVoucherRecord = resolve => require(['@/components/member_resume/memberVoucherRecord'], resolve);
const MemberInvoice = resolve => require(['@/components/member_invoice/memberInvoice'], resolve);
const MemberHelpContent = resolve => require(['@/components/member_card/memberHelpContent'], resolve);
const MemberIncrementInvoice = resolve => require(['@/components/member_invoice/memberIncrementInvoice'], resolve);
const mNameModifyRecord = resolve => require(['@/components/member_record/mNameModifyRecord'], resolve);
const mPurchaseRecords = resolve => require(['@/components/member_record/mPurchaseRecords'], resolve);

//视频导购 start
const VideoGuide = resolve => require(['@/components/video_guide/videoGuide'],resolve);
//视频导购 end

const err500 = resolve => require(['@/components/error/500'], resolve);
const err404 = resolve => require(['@/components/error/404'], resolve);

Vue.use(Router)
let router = new Router({
  mode: 'history',
  routes: [

    {
      path: '/member/memberQuery',
      name: 'member_Query',
      component: MemberQuery,
      meta: { 
        keepAlive: true
      }
    },
    {
      path: '/member/memberNewlyBuild',
      name: 'member_NewlyBuild',
      component: MemberNewlyBuild
    },
    {
      path: '/member/memberDetails',
      name: 'member_Details',
      component: MemberDetails
    },
    {
      path: '/member/memberAddress/:userId',
      name: 'member_Address',
      component: MemberAddress
    },
    {
      path: '/member/memberBeanRecord/:memberId',
      name: 'member_BeanRecord',
      component: MemberBeanRecord
    },
    {
      path: '/member/memberOrderRecord/:memberId',
      name: 'member_OrderRecord',
      component: MemberOrderRecord
    },
    {
      path: '/member/memberVoucherRecord/:memberId',
      name: 'member_VoucherRecord',
      component: MemberVoucherRecord
    },
    {
      path: '/member/memberInvoice',
      name: 'member_Invoice',
      component: MemberInvoice
    },
    {
      path: '/member/memberHelpContent',
      name: 'member_Invoice',
      component: MemberHelpContent
    },
    {
      path: '/member/memberIncrementInvoice',
      name: 'member_IncrementInvoice',
      component: MemberIncrementInvoice
    },
	{
      path: '/member/mNameModifyRecord',
      name: 'mNameModifyRecord',
      component: mNameModifyRecord
    },
	{
      path: '/member/mPurchaseRecords',
      name: 'mPurchaseRecords',
      component: mPurchaseRecords
    },
    {
      path: '/member/videoGuide',
      name: 'video_Guide',
      component: VideoGuide
    },

    {
      path: '/member/500',
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
   if(to.name=="err404" || to.name=="err500"){
      next();
      return;
  }
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
 router.afterEach(route => {
  document.getElementById('appLoading').style.display = 'none'; //隐藏loading 
})
export default router
