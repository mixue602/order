// 关于登陆的接口

import * as API from '../index'

import Env from '../env';
//https://easy-mock.com/mock/5addabc90ab25a3530febe1b/orderindex/queryOrderList
export default {
 
  //会员卡号或手机号
  orderMemberInfo: params => {
    return API.POST(Env.pcorderview+'/queryMemberInfo', params)
  },
  //导购员编号
  ordersellerInfo: params => {
    //return API.POST(Env.baseURL+'/5addabc90ab25a3530febe1b/orderindex/ordersellerInfo', params)
    //http://pcorderview.atguat.com.cn/queryEmployeeInfoByAccount
    return API.POST(Env.pcorderview+'/queryEmployeeInfoByAccount', params)
  },
  //占单列表页
  occupyingResources: (params) => {//占单列表页-导购单
    //return API.POST('http://mpf.atguat.com.cn:8088/pcsgpview/occupyingResources')
    return API.POST(Env.pcsgpview + '/occupyingResources',params)
  },
  searchSegmentForSingles: (params) => {//占单列表页-已开单未收款
    return API.POST(Env.pcorderview + '/searchSegmentForSingles',params)
  },
  //删除未收款订单原因列表
  queryDeleteReasonList: params => {
    return API.POST(Env.pcorderview+'/queryDeleteReasonList', params)
  },
  //http://pcorderview.atguat.com.cn/deleteOrder
  //删除订单
  deleteOrder: params => {
    return API.POST(Env.pcorderview+'/segmentDeleteOrder', params)
  },
  //删除导购单
  deleteGuiderOrder: params => {
    return API.POST(Env.pcsgpview+'/deleteSGP', params,'application/json;charset=UTF-8')
  }
}