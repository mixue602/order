//可卖数查询的接口

import * as API from '../index.js'

import Env from '../env';
export default {
    //定金总额查询接口
    queryUserStoreDeposit: params =>{
        return API.POST(Env.visualorder+'/order/queryUserStoreDeposit', params)
    },
    //十大品类接口
    getAllDeptInfo: params =>{
        return API.POST(Env.visualorder+'/order/getAllDeptInfo', params)
    },
    //充值接口
    saveOrder: params =>{
        return API.POST(Env.visualorder+'/order/saveOrder', params)
    }
}
