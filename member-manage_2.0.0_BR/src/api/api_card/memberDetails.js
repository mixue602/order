import * as API from '../'
import Env from '../env';
export default {
    // 卡详情
    cardQueryCardDetail: params => {
        return API.GET(Env.baseURL+'/card/queryCardDetail', params)
    },
    // 会员详情
    cardQueryUserDetail: params => {
        return API.GET(Env.baseURL+'/card/queryUserDetail', params)
    },
    // 卡修改，会员信息修改
    cardUpdateCard: params => {
        return API.POSTS(Env.baseURL+'/card/updateCard', params)
    },
    // 变更手机号（会员详情）
    phoneUpdate: params => {
        return API.POSTS(Env.baseURL+'/phone/update', params)
    },
    //校验短信验证码
    phoneCheck: params => {
        return API.GET(Env.baseURL+'/phone/check', params)
    },
    // 发送验证码
    phoneSending: params => {
        return API.GET(Env.baseURL+'/phone/sending', params)
    },
    // 检查手机号状态并发送验证码
    phoneSendingAndCheck: params => {
        return API.GET(Env.baseURL+'/phone/sendingAndCheck', params)
    }
}