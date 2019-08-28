//开单页的接口

import * as API from '../index.js'


import Env from '../env';
export default {
  querySellerCart: params =>{
    return API.POST(Env.pcBilling+"/querySellerCart", params)
  },
  //查询导购单
  // querySellerCart: params =>{
  //   return API.GET(" https://www.easy-mock.com/mock/5b3c6b723e96141ffe9caf05/querySellerCart2", params)
  // },
  //删除导购单
  deleteSellerBill: params =>{
    return API.POST(Env.pcBilling+"/deleteSellerBill", params)
  },
  //勾选导购单
  checkSellerBill: params =>{
    return API.POST(Env.pcBilling+"/checkSellerBill", params)
  },

  //取消勾选导购单
  unCheckSellerBill: params =>{
    return API.POST(Env.pcBilling+"/unCheckSellerBill", params)
  },
  //全选导购单
  checkAllSellerBill: params =>{
    return API.POST(Env.pcBilling+"/checkAllSellerBill", params)
  },
  //取消全选导购单
  unCheckAllSellerBill: params =>{
    return API.POST(Env.pcBilling+"/unCheckAllSellerBill", params)
  },
  //使用美豆
  useGomeDo: params =>{
    return API.POST(Env.pcBilling+"/useGomeDo", params)         
  },
  //保存发票
  saveInvoiceToCart: params =>{
    return API.POST(Env.pcBilling+"/saveInvoiceToCart", params)
  },
  //发送短信验证码
  resendVerificationCode: params =>{
    return API.POST(Env.pcBilling+"/resendVerificationCode", params)
  },
  //去付款
  commitOrder: params =>{
    return API.POST(Env.pcBilling+"/commitOrder", params)
  },
  //保存补购
  initValueAddSellerBill: params =>{
    return API.POST(Env.pcBilling+"/initValueAddSellerBill", params)
  },
   //勾选或取消满减满折
  checkPriceAdjust: params =>{
    return API.POST(Env.pcBilling+"/checkPriceAdjust", params)
    //return API.GET("https://www.easy-mock.com/mock/5afaa3452c5ab01b0cbf43e0/deleteGuiderOrder",params)
  },
  //保存满减满折促销信息
  savePriceAdjustPromotion: params =>{
    return API.POST(Env.pcBilling+"/savePriceAdjustPromotion", params)
    //return API.GET("https://www.easy-mock.com/mock/5afaa3452c5ab01b0cbf43e0/deleteGuiderOrder",params)
  },
  // 加价换购
  queryShowGift: params =>{
    return API.POST(Env.pcBilling+'/queryShowGift', params);
  },
  // 加价换购互斥
  checkJjhgPromotion: params =>{
    return API.POST(Env.pcBilling+'/checkJjhgPromotion', params);
  },
  // 申请或修改节能补贴信息
  updateAllowance: params =>{
    return API.POST(Env.pcBilling+'/updateAllowance', params);
  },
  // 删除节能补贴信息
  removeAllowance: params =>{
    return API.POST(Env.pcBilling+'/removeAllowance', params)
  },
  // 预存款勾选定金互斥校验
  checkDeposit: params =>{
    return API.POST(Env.pcBilling+'/checkDeposit', params)
  },
  // 预存款提交勾选
  submitCheckDeposit: params =>{
    return API.POST(Env.pcBilling+'/submitCheckDeposit', params)
  },
}


