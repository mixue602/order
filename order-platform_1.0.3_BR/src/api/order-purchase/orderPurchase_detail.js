// 关于登陆的接口

import * as API from '../index.js'

import Env from '../env';
export default {
  //http://pcorderview.atguat.com.cn/queryGuiderOrderDetail
  //导购单详情页信息
  queryGuiderOrderDetail: params => {
    //return API.POST(Env.pcorderview+'/queryGuiderOrderDetail', params)
    return API.POST(Env.pcsgpview+'/queryGuiderOrderDetail', params,'application/json;charset=UTF-8')
  },
  //http://pcorderview.atguat.com.cn/queryDetailPageMemberPhone
  //查看手机完整号
  queryDetailPageMemberPhone: params => {
    //return API.POST(Env.pcorderview+'/queryDetailPageMemberPhone', params)
    return API.POST(Env.pcsgpview+'/queryDetailPageMemberPhone', params,'application/json;charset=UTF-8')
  }
}
