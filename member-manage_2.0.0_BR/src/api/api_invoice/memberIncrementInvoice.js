import * as API from '../'
import Env from '../env';
export default {
    // 增值税发票查询
    queryInvoiceList : params => {
        return API.GET(Env.baseURL+'/invoice/queryInvoiceList', params)
    },
    // 增票信息查询-Id
    queryInvoiceDetail: params => {
        return API.GET(Env.baseURL+'/invoice/queryInvoiceDetail', params)
    },
    // 增票信息更新
    updateInvoiceInfo: params => {
        return API.POSTS(Env.baseURL+'/invoice/updateInvoiceInfo', params)
    }
}