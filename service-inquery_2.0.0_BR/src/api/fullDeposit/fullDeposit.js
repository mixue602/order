//可卖数查询的接口

import * as API from '../index.js'

import Env from '../env';
export default {
    //获取全额定金时间周期接口
    queryFullAmountTime:params =>{
        return API.GET(Env.mobile+'/staffmobile/product/search/queryFullAmountTime',params)
    },
    //查询全额定金商品
    queryFullAmount:params =>{
        return API.POSTS(Env.mobile+'/staffmobile/product/search/queryFullAmount',params)
    },
}
