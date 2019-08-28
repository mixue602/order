import * as API from '../'
import Env from '../env';
export default {
    // 会员购买记录
    queryMemberBuyRecordList: params => {
        return API.POST(Env.pcorderview+'/queryMemberBuyRecordList', params)
    },
    queryMemberName: params => {
        return API.POST(Env.pcorderview+'/queryMemberName', params)
    }
}