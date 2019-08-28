import * as API from '../'
import Env from '../env';
export default {
    queryCardNameModifyRecords: params => {
        return API.POSTS(Env.gomedoURL+'/card/queryCardNameModifyRecords', params)
    },
    queryCardNameOrMobile: params => {
        return API.GET(Env.gomedoURL+'/card/queryCardNameOrMobile', params)
    }
}