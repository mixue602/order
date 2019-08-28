//可卖数查询的接口

import * as API from '../index.js'

import Env from '../env';
export default {
  //登录
  login: params => {
    return API.GET(Env.baseURL+'/ceshi', params)
  },
  usertDefaultInfo: params =>{
    return API.POST(Env.pcatpview+'/querySellNumConditionInit', params)
  },
  querySkuList: params => {
    return API.POST(Env.pcatpview+'/querySkuList', params)
  },
  queryBrandList: params => {
    return API.POST(Env.pcatpview+'/queryBrandList', params)
  },
  querySupplierList: params => {
    return API.POST(Env.pcatpview+'/querySupplierList', params)
  },
  querySellNumList: params => {
    return API.POST(Env.pcatpview+'/querySellNumList', params)
  },
  getUserOfflineInfo: params => {//获取登录用户信息接口
    return API.GET(Env.laigoaccess+'/user/getUserOfflineInfo', params)
  },
  getSaleList: params => {//可卖数列表列表接口
    return API.POST(Env.laigoaccess+'/queryread/getSaleList', params)
  },
  getCategory: params => {//根据岗位查询品类信息接口
    return API.GET(Env.laigoaccess+'/queryread/category', params)
  },
  getSummaryQtyData: params => {//查询可卖数汇总接口
    return API.POST(Env.laigoaccess+'/queryread/getSummaryQtyData', params)
  },
  getOffLineStoreInfo: params=>{
    return API.GET(Env.laigoaccess+'/store/getOffLineStoreInfo', params)
  }
  
}
