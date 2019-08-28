import * as API from '../'
import Env from '../env';
export default {
    // 查询优惠券状态接口
    queryCouponStateList: params=> {
        return API.POST(Env.derviewURL+'/queryCouponStateList', params)
    },
    // 查询优惠券列表接口
    queryCouponList:params=> {
        return API.POST(Env.derviewURL+'/queryCouponList', params)
    }
}
