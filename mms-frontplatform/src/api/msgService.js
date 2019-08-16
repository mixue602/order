import { mmsDomain } from 'api/config'
import Api from 'api/api'
let api = new Api()

/** 直播间 start */
export function queryDateKpis (data, callback) {
  const url = mmsDomain.mmsr + '/mms/report/queryDateKpis'
  return api.jsonp(url, data, callback)
}
/** 直播间 end */

/** 营销效果页面 start */
export function countMarketings (data, callback) {
  const url = mmsDomain.mmsr + '/mms/report/countMarketings'
  return api.jsonp(url, data, callback)
}
export function queryMarketings (data, callback) {
  const url = mmsDomain.mmsr + '/mms/report/queryMarketings'
  return api.jsonp(url, data, callback)
}
export function exportReport (data) {
  const url = mmsDomain.mmsr + '/mms/report/exportReport'
  return api.exportFile(url, data)
}
/** 营销效果页面 end */

/** 营销效果页面单 start */
export function queryMarketingDetaile (data, callback) {
  const url = mmsDomain.mmsr + '/mms/report/queryMarketingDetaile'
  return api.jsonp(url, data, callback)
}
/** 营销效果页面单 end */

/** 短信公共信息接口 start */
export function getTask (callback) {
  const url = mmsDomain.mmsc + '/msgtask/getTasklistCondition.do'
  const data = {}
  return api.jsonp(url, data, callback)
}
export function getTaskRef (callback) {
  const url = mmsDomain.mmsc + '/msgtask/getTaskRef.do'
  const data = {}
  return api.jsonp(url, data, callback)
}
/** 短信公共信息接口 end */

/** 发送短信记录页面接口 start */
export function sendInfoList (data, callback) {
  const url = mmsDomain.mmsc + '/mms/sms/sendInfoList.do'
  return api.jsonp(url, data, callback)
}
/** 发送短信记录页面接口 end */

/** 回复短信记录页面接口 start */
export function sendReplayList (data, callback) {
  const url = mmsDomain.mmsc + '/mms/sms/sendReplayList.do'
  return api.jsonp(url, data, callback)
}
export function exportReplayList (data) {
  const url = mmsDomain.mmsc + '/mms/sms/exportReplayList.do'
  return api.exportFile(url, data)
}
/** 回复短信记录页面接口 end */

/** 短信模板页面接口 start */
export function tempList (data, callback) {
  const url = mmsDomain.mmsc + '/mms/smsTmpl/list.do'
  return api.jsonp(url, data, callback)
}
export function tempCreat (data, callback) {
  const url = mmsDomain.mmsc + '/mms/smsTmpl/insert.do'
  return api.jsonp(url, data, callback)
}
export function tempModify (data, callback) {
  const url = mmsDomain.mmsc + '/mms/smsTmpl/update.do'
  return api.jsonp(url, data, callback)
}
export function tempDelete (data, callback) {
  const url = mmsDomain.mmsc + '/mms/smsTmpl/del.do'
  return api.jsonp(url, data, callback)
}
/** 短信模板页面接口 end */

/** 短信任务管理页面接口 start */
export function getTaskList (data, callback) {
  const url = mmsDomain.mmsc + '/msglst/getTaskList.do'
  return api.jsonp(url, data, callback)
}
export function getsubTaskList (data, callback) {
  const url = mmsDomain.mmsc + '/msglst/getsubTaskList.do'
  return api.jsonp(url, data, callback)
}
export function delTaskCase (data, callback) {
  const url = mmsDomain.mmsc + '/msglst/delTaskCase.do'
  return api.jsonp(url, data, callback)
}
export function sendTaskCase (data, callback) {
  const url = mmsDomain.mmsc + '/msglst/execTaskCase.do'
  return api.jsonp(url, data, callback)
}
export function stopTaskCase (data, callback) {
  const url = mmsDomain.mmsc + '/msglst/stopTaskCase.do'
  return api.jsonp(url, data, callback)
}
/** 短信任务管理页面接口 end */

/** 新建短信任务页面接口 start */
export function checkSensitiveWords (data, callback) {
  const url = mmsDomain.mmsc + '/msglst/CheckSensitiveWords.do'
  return api.post(url, data, callback)
}
export function getMsgUserGroup (data, callback) {
  const url = mmsDomain.mmsc + '/msgtask/getUGRefByType.do'
  return api.jsonp(url, data, callback)
}
export function getMsgTestGroup (data, callback) {
  const url = mmsDomain.mmsc + '/msgtask/getTestUGRef.do'
  return api.jsonp(url, data, callback)
}
export function getGroupNum (data, callback) {
  const url = mmsDomain.mmsc + '/msgtask/getUGsNumber.do'
  return api.jsonp(url, data, callback)
}
export function getMsgTemp (callback) {
  const url = mmsDomain.mmsc + '/mms/smsTmpl/getTmplList.do'
  var data = {}
  return api.jsonp(url, data, callback)
}
export function testSave (data, callback) {
  const url = mmsDomain.mmsc + '/msgtask/generateTestTask.do'
  var newData = JSON.parse(JSON.stringify(data))
  newData.shortMsgContentA += /退订回T$/.test(newData.shortMsgContentA) ? '' : '退订回T'
  newData.shortMsgContentB += newData.shortMsgContentB.length > 0 ? (/退订回T$/.test(newData.shortMsgContentB) ? '' : '退订回T') : ''
  return api.post(url, newData, callback)
}
export function msgSave (data, callback) {
  const url = mmsDomain.mmsc + '/msgtask/generateTask.do'
  var newData = JSON.parse(JSON.stringify(data))
  newData.shortMsgContentA += /退订回T$/.test(newData.shortMsgContentA) ? '' : '退订回T'
  newData.shortMsgContentB += newData.shortMsgContentB.length > 0 ? (/退订回T$/.test(newData.shortMsgContentB) ? '' : '退订回T') : ''
  return api.post(url, newData, callback)
}
export function checkSub (data, callback) {
  const url = mmsDomain.mmsc + '/msgtask/checkSubjectExist.do'
  return api.jsonp(url, data, callback)
}
export function copyMsg (data, callback) {
  const url = mmsDomain.mmsc + '/msglst/copyTaskCase.do'
  return api.jsonp(url, data, callback)
}
/** 新建短信任务页面接口 end */
export function pageAuthorized (data, callback) {
  const url = mmsDomain.mmsc + '/mms/authorize/pageAuthorized.do'
  return api.jsonp(url, data, callback)
}
