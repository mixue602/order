import * as API from '../'
import Env from '../env';
export default {
    /** 品牌品类 */
    getBrandCategory: params=> {
    	//http://mpf.atguat.com.cn/laigoaccess/categorybrand/getcategorybrand
    	// return API.GET('http://'+window.location.host+'/pcorderview/queryUserMultiCateList',params);
        return API.GET(Env.videoGuideUrl+'/categorybrand/getcategorybrand', params)
    },
    getAuditList: params=>{
    	// return API.GET('https://www.easy-mock.com/mock/5b2c9be9195e435411457751/example/getAuditList',params);
    	return API.POST(Env.videoGuideUrl+'/audit/getAuditList', params)
    },
    getAuditLog: params=>{
    	// return API.GET('https://www.easy-mock.com/mock/5b2c9be9195e435411457751/example/getAuditLog',params);
    	return API.GET(Env.videoGuideUrl+'/audit/getAuditLog', params)
    },
    getAuditExcel: params=>{
    	// return API.GET('https://www.easy-mock.com/mock/5b2c9be9195e435411457751/example/getAuditExcel',params);
    	return API.GET(Env.videoGuideUrl+'/audit/getAuditExcel', params)
    },
    addOrUpdateAuditInfo: params=>{
    	// return API.GET('https://www.easy-mock.com/mock/5b2c9be9195e435411457751/example/addOrUpdateAuditInfo',params);
    	// return API.POST(Env.videoGuideUrl+'/audit/addOrUpdateAuditInfo', params, 'application/x-www-form-urlencoded;charset=UTF-8')
    	return API.GET(Env.videoGuideUrl+'/audit/addOrUpdateAuditInfo', params)
    },
    getStoreInfo: params=>{
    	// return API.GET('https://www.easy-mock.com/mock/5b2c9be9195e435411457751/example/getStoreInfo',params);
    	return API.GET(Env.videoGuideUrl+'/store/getStoreInfo', params)
    },
    getLoginInfo: params=> {
        return API.GET(Env.videoGuideUrl+'/user/getLoginInfo', params)
    },
    getUserOfflineInfo: params => {//获取登录用户信息接口
        return API.GET(Env.videoGuideUrl+'/user/getUserOfflineInfo', params)
    },
}
