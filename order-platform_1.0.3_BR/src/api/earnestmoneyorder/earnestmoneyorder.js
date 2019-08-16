// 申请退订金

import * as API from '../index';
import Env from '../env';

export default {
    // 删单
    cancelOrder: params => {
        return API.POST(Env.visualorder + "/order/cancelOrder", params)
    },
    // 定金翻倍详情页
    queryOrderDetail: params => {//http://mpf.atguat.com.cn/visualorder/order/queryOrderDetail
        return API.POST(Env.visualorder + "/order/queryOrderDetail", params)
    },
     // 定金翻倍订单履历
    queryOrderLogList: params => {//http://mpf.atguat.com.cn/visualorder/order/queryOrderDetail
        return API.POST(Env.visualorder + "/order/queryOrderLogList", params)
    },
    //预支付接口
    confirmPayForCart: params => {//http://mpf.atguat.com.cn/visualorder/order/queryOrderDetail
        return API.POST(Env.visualorder + "/pay/confirmPayForCart", params)
    },
    //订金状态列表
    queryOrderStatusList: params => {//http://mpf.atguat.com.cn/visualorder/order/queryOrderDetail
        return API.POST(Env.visualorder + "/order/queryOrderStatusList", params)
    },
    //订金状态列表
    queryOrderList: params => {//http://mpf.atguat.com.cn/visualorder/order/queryOrderDetail
        return API.POST(Env.visualorder + "/order/queryOrderList", params)
    },
}