
// 关于登陆的接口

import * as API from '../index'

import Env from '../env';
//订单详情页拆单前
export default {
  orderdetailsbeforesplit: params => {
    return API.POST(Env.pcorderview+'/queryUnsplitedOrderDetail', params)
  },
  //订单查看完整手机号
  lookTelNum: params => {
    return API.POST(Env.pcorderview+'/queryFullPhoneNo', params)
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
    //return API.POST(Env.baseURL+'/5addabc90ab25a3530febe1b/orderindex/queryOrder', params)
    return API.POST(Env.pcorderview+'/queryOrderResumeList', params)
  },
  //选择机型
  queryType: params => {
    //return API.POST(Env.baseURL+'/5addabc90ab25a3530febe1b/orderindex/queryOrder', params)
    return API.POST(Env.pcorderview+'/queryOrderAPT', params)
  }
}