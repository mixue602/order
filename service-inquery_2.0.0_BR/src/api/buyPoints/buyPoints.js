//接口文档：http://10.115.4.53:8080/gaim/interfaceDetail.do?#/api/detail/f90b45d1-bac9-488a-9cae-fb90f2442333

import * as API from '../index.js'

import Env from '../env';
export default {
    //保存美豆充值
    saveGomedoOrder: params =>{
        return API.POST(Env.visualorder+'/order/saveGomedoOrder', params)
    },
}
