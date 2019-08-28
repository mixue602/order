import * as API from '../'
import Env from '../env';
export default {
    //会员卡列表查询接口
    queryCard: params => {
        return API.GET(Env.baseURL+"/card/queryCard", params)
    },
    // 卡检查（点击卡升级检查卡的状态）
    checkCard: params => {
        return API.GET(Env.baseURL+'/card/checkCard', params)
    },
    // 发送验证码
    phoneSending: params => {
        return API.GET(Env.baseURL+'/phone/sending', params)
    },
    // 绑卡（升级验证）
    cardBindingCard: params => {
        return API.POSTS(Env.baseURL+'/card/bindingCard', params)
    },
    // 完善手机号发送验证码
    updateCardPhone: params => {
        return API.POSTS(Env.baseURL+'/phone/updateCardPhone', params)
    },
    // 验证完善手机号
    phoneMobileVcode: params => {
        return API.POSTS(Env.baseURL+'/phone/checkUpdateMobileVcode', params)
    }
}