// 申请退订金

import * as API from '../index';
import Env from '../env';

export default {
   
    //列表
    queryOrderList: params => {//http://mpf.atguat.com.cn/visualorder/order/queryOrderDetail
        return API.POST(Env.pcorderview + "/getReturnInvoiceList", params)
    },
    confirmReturnInvoice: params => {//http://mpf.atguat.com.cn/visualorder/order/queryOrderDetail
        return API.POST(Env.pcorderview + "/confirmReturnInvoice", params)
    }
}