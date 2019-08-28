import * as API from '../'
import Env from '../env';
export default {
    /** 美豆查询 */
    queryResume: params=> {
        return API.GET(Env.gomedoURL+'/gomedo/queryResume', params)
    }
}
