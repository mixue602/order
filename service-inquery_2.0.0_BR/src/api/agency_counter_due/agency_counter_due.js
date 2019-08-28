//待付款订单页面接口
import * as API from '../index.js';
import Env from '../env';

export default {
  //查询待支付订单列表接口
  queryUnPaidOrderList: params =>{
    return API.POST(Env.pcpayview+'/queryUnPaidOrderList', params)
  },
  //查询待支付订单商品详情列表
  queryUnPaidGoodsItemInfoList: params => {
    return API.POST(Env.pcpayview+'/queryUnPaidGoodsItemInfoList', params)
  },
  //修改备注
  updateGoodsItemMemo: params => {
    return API.POST(Env.pcpayview+'/updateGoodsItemMemo', params)
  },
  //确认收款
  confirmReceipt: params => {
    return API.POST(Env.pcpayview+'/confirmReceipt', params)
  },
  //订金翻倍确认收款
  confirmPayForOrder: params => {
    return API.POST(Env.visualorder+'/pay/confirmPayForOrder',params)
  }
}
