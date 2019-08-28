//开单页的接口

import * as API from '../index.js'

import Env from '../env';
export default {
  //点击配送方式(门店自提 国美配送)加载不同数据
  queryShowGift: params =>{
    return API.POST(Env.pcBilling+'/queryShowGift', params);
  },
  //保存促销信息
  savePromotion: params =>{
    return API.POST(Env.pcBilling+'/savePromotion', params);
  },
  //获取商品信息
  getSkuInfo: params =>{
    return API.POST(Env.pcBilling+'/getSkuInfo', params)
  },
  //根据卡号或手机号查询会员卡信息接口
  queryMemberCardList: params =>{
    return API.POST(Env.pcBilling+'/queryMemberCardList', params)
  },
  //创建临时卡接口
  addTempCard: params =>{
    return API.POST(Env.pcBilling+'/addTempCard', params)
  },
  //添加到导购车接口更改仓库信息时类型传store,不用传地址参数，其它的是add，不用传仓库信息
  addToBill: params =>{
    return API.POST(Env.pcBilling+'/addToBill', params)
  },

  //开单所以信息接口
  loadSellOrder: params =>{
    return API.POST(Env.pcBilling+'/loadSellBill', params)
  },

  //根据会员id查地址信息列表
  queryMemberAddressList: params =>{
    return API.POST(Env.pcBilling+'/queryMemberAddressList', params)
  },

  //新增地址接口
  addMemberAddress: params =>{
    return API.POST(Env.pcBilling+'/addMemberAddress', params)
  },

  //新增地址接口
  saveAddress: params =>{
    return API.POST(Env.pcBilling+'/saveAddress', params)
  },

  //切换配送方式接口
  changeDeliveryWay: params =>{
    return API.POST(Env.pcBilling+'/changeDeliveryWay', params)
  },

  //修改商品价格
  updatePrice: params =>{
    return API.POST(Env.pcBilling+'/updatePrice', params)
  },

  //导购单查询单品建档
  loadTransportAndInstall:params =>{
    return API.POST(Env.pcBilling+'/loadTransportAndInstall', params)
  },
  //查询单品运能接口
  queryTransportCapability:params =>{
    return API.POST(Env.pcBilling+'/queryTransportCapability', params)
  },
  // 查询单品安装能接口
  queryInstallCapability:params =>{
    return API.POST(Env.pcBilling+'/queryInstallCapability', params)
  },
  //查询安装方式接口
  queryInstallTypes:params =>{
    return API.POST(Env.pcBilling+'/queryInstallTypes', params)
  },
  //开单页保存单品建档
  saveTransportAndInstall:params =>{
    return API.POST(Env.pcBilling+'/saveTransportAndInstall', params)
  },
  //修改商品信息查询
  queryGoodsAtpInfo:params =>{
    return API.POST(Env.pcBilling+'/queryGoodsAtpInfo', params)
  },
  //修改备注信息接口
  saveRemarks: params =>{
    return API.POST(Env.pcBilling+'/saveRemarks', params)
  },
  //券操作（查询、勾选、取消勾选）
  opereationUseCoupon: params =>{
    return API.POST(Env.pcBilling+'/opereationUseCoupon', params)
  },
  //加载用券信息
  loadUseCoupon: params =>{
    return API.POST(Env.pcBilling+'/loadUseCoupon', params)
  },
  //购买延保
  addIncrementItemToBillOrCart: params =>{
    return API.POST(Env.pcBilling+'/addIncrementItemToBillOrCart', params)
  },
  //保存业务机型
  saveItemType: params =>{
    return API.POST(Env.pcBilling+'/saveItemType', params)
  },
  //修改商品数量
  updateQuantity: params =>{
    return API.POST(Env.pcBilling+'/updateQuantity', params)
  },
  //编辑导购单
  loadEditSellerBill: params =>{
    return API.POST(Env.pcBilling+'/loadEditSellerBill', params)
  },
  //完成开单
  commitSellerBill: params =>{
    return API.POST(Env.pcBilling+'/commitSellerBill', params)
  },
  //店长券添加、删除
  useStoreCoupon: params =>{
    return API.POST(Env.pcBilling+'/useStoreCoupon', params)
  },
  // 发送短信验证码
  sendMsg:params =>{
    return API.POST(Env.pcBilling+'/sendMsg',params)
  },
  //校验短信验证码
  validMsg:params =>{
    return API.POST(Env.pcBilling+'/validMsg',params)
  },
  //校验短信验证码
  bindMobile:params =>{
    return API.POST(Env.pcBilling+'/bindMobile',params)
  },
  //查询赠卡信息
  queryGiftCard:params =>{
    return API.POST(Env.pcBilling+'/queryGiftCard',params)
  },
  //使用蓝卡/补贴卡
  useGiftCard:params =>{
    return API.POST(Env.pcBilling+'/useGiftCard',params)
  },
  //取消蓝卡/补贴卡
  cancelGiftCard:params =>{
    return API.POST(Env.pcBilling+'/cancelGiftCard',params)
  },
}
