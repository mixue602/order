import * as API from '../'
import Env from '../env';
export default {
    // 审批流申请（可做申请冻结、申请解冻、申请解黑操作）
    flowInit: params => {
        return API.POSTS(Env.baseURL+"/flow/init", params)
    },
    // 审批流查询（对申请冻结、解冻，查询审批流申请信息）
    flowQuery: params => {
        return API.GET(Env.baseURL+'/flow/query', params)
    },
    // 审批流执行（可做执行冻结、执行解冻、执行解黑操作）
    flowExecute: params => {
        return API.POSTS(Env.baseURL+'/flow/execute', params)
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