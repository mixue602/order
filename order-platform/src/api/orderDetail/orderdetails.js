
// 关于登陆的接口

import * as API from '../index'

import Env from '../env';
export default {
  //订单详情页
  orderdetails: params => {
    //return API.POST(Env.baseURL+'/5addabc90ab25a3530febe1b/orderindex/orderdetails', params)
    return API.POST(Env.pcorderview+'/querySplitedOrderDetail', params)
  },
  //订单查看完整手机号
  lookTelNum: params => {
    return API.POST(Env.pcorderview+'/queryFullPhoneNo', params)
  },
  //查询配送履历
  orderShippingResume: params => {
    return API.POST(Env.pcorderview+'/queryShippingResumeList', params)
  },
  //查询安装履历
  orderInstallResume: params => {
    return API.POST(Env.pcorderview+'/queryInstallResumeList', params)
  },
  //订单查看完整会员手机号
  memberPhone: params => {
    return API.POST(Env.pcorderview+'/queryDetailPageMemberPhone', params)
  },
  //取消订单
  cancelOrder: params => {
    return API.POST(Env.pcorderview+'/cancelOrder', params)
  },
  //订单履历
  queryOrder: params => {
    return API.POST(Env.pcorderview+'/queryOrderResumeList', params)
  },
  //正向关联退换货列表
  queryreturninfo: params => {
    //return API.POST(Env.baseURL+'/5addabc90ab25a3530febe1b/orderindex/queryreturninfo', params)
    return API.POST(Env.pcorderview+'/queryReturnList', params)
  }
}