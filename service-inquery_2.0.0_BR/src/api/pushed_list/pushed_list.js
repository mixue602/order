//店长推荐的接口

import * as API from '../index.js'

import Env from '../env';
export default {
  //登录
  login: params => {
    return API.GET(Env.baseURL+'/ceshi', params)
  },
  //查询登陆人信息
  getLoginUserInfo:params =>{
    return API.POST(Env.pcBilling+'/getLoginUserInfo', params)
  },
  //切换营业员
  changeSeller: params =>{
    //return API.POST(Env.pcatpview+'/changeSeller', params)
  },
  //查询会员近期导购单列表
  queryCustomerCards: params =>{
    return API.POST(Env.pcsgpview+'/queryCustomerCards', params,'application/json;charset=UTF-8')
  },
   //查询是否是店长
   searchType: params =>{
    return API.POST(Env.pcsgpview+'/searchType', params,'application/json;charset=UTF-8')
  },
  //搜索商品列表(2018-12-19 增加热销商品接口)
  searchSku: params =>{
    if(params.searchRec == 1 || params.searchRec == 3){//推荐商品或带单提奖
      return API.POST(Env.pcBilling+'/searchSku', params)
    }else if(params.searchRec == 2){//品类热销
      return API.POST(Env.pcBilling+'/getCategoryHot', params)
    }else{//热销商品接口
      return API.POST(Env.pcBilling+'/queryHot', params)
    }
  },

  //查询全部品类数据
  getHomeClassify:params =>{
    return API.GET(Env.staffpc+'/product/search/homeClassify')
  },
}
