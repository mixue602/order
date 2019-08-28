import * as API from '../index.js'

import Env from '../env';
// 延保补购购买
export default {
  querySupplyWarrantyOrderList: params => {
    return API.POST(Env.pcorderview + '/querySupplyWarrantyOrderList', params)
  },
  //查询购买补够延保
  queryIncrementServiceDetail: params => {
    return API.POST(Env.pcBilling + '/queryIncrementServiceDetail', params)
  },
  //提交购买补够延保
  AddSellerBill: params => {
    return API.POST(Env.pcBilling + '/initValueAddSellerBill', params)
  },
}
