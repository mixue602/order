
// 关于登陆的接口

import * as API from '../index'

import Env from '../env';
export default {
  //列表页
  queryGomedoOrderList: params => {
    return API.POST(Env.visualorder+'/order/queryGomedoOrderList', params)
  },
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
  //订单状态
  queryOrderStateList: params => {
    return API.POST(Env.visualorder+'/order/queryOrderStatusList', params)
  },
  //支付方式
  queryGomedoPayMethodList: params => {
    return API.GET(Env.visualorder+'/order/queryGomedoPayMethodList', params)
  },
  //导出
  exportGomedoOrderList: params => {
   // return API.POST(Env.visualorder+'/order/exportGomedoOrderList', params)
    return API.Axios({
      method:'post',
      url:Env.visualorder + '/order/exportGomedoOrderList',
      responseType:'blob',
      data:params
    })
  },
  //会员积分充值详情页
  queryGomedoOrderDetail:params => {
    return API.POST(Env.visualorder+'/order/queryGomedoOrderDetail', params)
  },
  //订单履历
  queryOrderLogList:params => {
    return API.POST(Env.visualorder+'/order/queryOrderLogList', params)
  },
  //删单
  cancelOrder: params => {
    return API.POST(Env.visualorder + "/order/cancelOrder", params)
  },
  //预支付接口
  confirmPayForCart: params => {//http://mpf.atguat.com.cn/visualorder/order/queryOrderDetail
    return API.POST(Env.visualorder + "/pay/confirmPayForCart", params)
  },
}