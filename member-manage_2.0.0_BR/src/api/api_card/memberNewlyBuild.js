import * as API from '../'
import Env from '../env';
export default {
    // 开卡（新建会员卡）
    openCard: params => {
        return API.POSTS(Env.baseURL+'/card/openCard', params)
    },
    // 检查手机号状态并发送验证码
    phoneSendingAndCheck: params => {
        return API.GET(Env.baseURL+'/phone/sendingAndCheck', params)
    }
}