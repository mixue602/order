// 申请退订金

import * as API from '../index';
import Env from '../env';

export default {
    // 退订金初始化
    applyRefund: params => {
        return API.POST(Env.visualorder + "/refund/applyRefund", params)
    },
    // 提交退订金
    comifrmRefund: params => {
        return API.POST(Env.visualorder + "/refund/comifrmRefund", params)
    },
    // 退订金列表
    queryRefundList: params => {
        return API.POST(Env.visualorder + '/refund/queryRefundList', params)
    },
    // 退订金详情
    queryRefundDetail: params => {
        return API.POST(Env.visualorder + '/refund/queryRefundDetail', params)
    },
    // 退订金取消
    cancelRefund: params => {
        return API.POST(Env.visualorder + '/refund/cancelRefund', params)
    },
    // 退订金审核
    auditRefund: params => {
        return API.POST(Env.visualorder + '/refund/auditRefund', params)
    }
}