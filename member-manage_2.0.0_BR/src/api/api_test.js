
import * as API from './'

export default {
  //登录
  login: params => {
    return API.GET('/login', params)
  },
  /** 美豆查询 */
  queryResume: params=> {
    return API.GET('/meidou', params)
  },
  // 查询优惠券状态接口
  queryCouponStateList: params=> {
    return API.GET('/couponStateList', params)
  },
  // 查询优惠券列表接口
  queryCouponList:params=> {
    return API.GET('/couponList', params)
  },
  // 查询订单状态列表接口
  queryOrderStateList:params=> {
    return API.GET('/queryOrderStateList', params)
  },
  //查询会员订单列表接口
  queryMemberOrderList:params=> {
    return API.GET('/queryMemberOrderList', params)
  },
  // 根据订单id查询订单发票列表
  queryInvoiceList:params=> {
    return API.GET('/queryInvoiceList', params)
  },
  //修改邮箱接口
  updateInvoiceMail:params=> {
    return API.GET('/updateInvoiceMail', params)
  },
  resendInvioceMail:params=> {
    return API.GET('/resendInvioceMail', params)
  },
  //会员卡列表查询接口
  queryCard: params => {
    return API.GET("//mpf.atguat.com.cn/midesk/members/card/queryCard?pc=18612660813", params)
  },
  // 审批流申请（可做申请冻结、申请解冻、申请解黑操作）
  flowInit: params => {
    return API.GET("/flow/init", params)
  },
  // 审批流查询（对申请冻结、解冻，查询审批流申请信息）
  flowQuery: params => {
    return API.GET('/flow/query', params)
  },
  // 审批流执行（可做执行冻结、执行解冻、执行解黑操作）
  flowExecute: params => {
    return API.GET('/flow/execute', params)
  },
  // 卡检查（点击卡升级检查卡的状态）
  checkCard: params => {
    return API.GET('/card/checkCard', params)
  },
  // 发送验证码
  phoneSending: params => {
    return API.GET('/phone/sending', params)
  },
  // 绑卡（升级验证）
  cardBindingCard: params => {
    return API.GET('/card/bindingCard', params)
  },
  // 开卡（新建会员卡）
  openCard: params => {
    return API.GET('/card/openCard', params)
  },
  // 检查手机号状态并发送验证码
  phoneSendingAndCheck: params => {
    return API.GET('/phone/sendingAndCheck', params)
  },
  // 会员详情
  cardQueryUserDetail: params => {
    return API.GET('/card/queryUserDetail', params)
  },
  // 卡修改，会员信息修改
  cardUpdateCard: params => {
    return API.GET('/card/updateCard', params)
  },
  // 变更手机号（会员详情）
  phoneUpdate: params => {
    return API.GET('/phone/update', params)
  },
  //校验短信验证码
  phoneCheck: params => {
    return API.GET('/phone/check', params)
  }
}
