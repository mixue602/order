import * as API from '../'
import Env from '../env';
export default {
    // 查询订单状态列表接口
    // queryOrderStateList:params=> {
    //     return API.POST(Env.derviewURL+'/queryOrderStateList', params)
    // },
    //查询会员订单列表接口
    queryMemberOrderList:params=> {
        return API.POST(Env.derviewURL+'/queryMemberOrderList', params)
    }
}
