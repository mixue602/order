import * as API from '../'
import Env from '../env';
export default {
    // 根据订单id查询订单发票列表
    queryInvoiceList:params=> {
        return API.POST(Env.derviewURL+'/queryInvoiceList', params)
    },
     //修改邮箱接口
    updateInvoiceMail:params=> {
        return API.POST(Env.derviewURL+'/updateInvoiceMail', params)
    },
    resendInvioceMail:params=> {
        return API.POST(Env.derviewURL+'/resendInvioceMail', params)
    }
}
