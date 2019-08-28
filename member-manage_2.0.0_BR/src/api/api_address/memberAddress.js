import * as API from '../'
import Env from '../env';
export default {
    //地址查询
    addrQuery: params => {
        return API.GET(Env.baseURL+'/Addr/query', params)
    },
    //地址添加
    addrAdd: params => {
        return API.POSTS(Env.baseURL+'/Addr/add', params)
    },
    // 地址修改
    addrEdit: params => {
        return API.POSTS(Env.baseURL+'/Addr/edit', params)
    },
    // 地址查询ID
    addrQueryById: params => {
        return API.GET(Env.baseURL+'/Addr/queryById', params)
    },
    // 地址删除
    addrDel: params => {
        return API.POSTS(Env.baseURL+'/Addr/del', params)
    },
    // 批量删除
    batchDelAddress: params => {
        return API.POSTS(Env.baseURL+'/Addr/batchDelAddress', params)
    }
}