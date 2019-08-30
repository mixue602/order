import { mmsDomain } from 'api/config'
import Api from 'api/api'
let api = new Api()
// var mmsDomain = 'http://mmsc.atguat.com.cn/mms'

export function postUrl (params, cb) {
  return api.post('info/CarSource/release', params, cb)
}
export function postSaveHandTestGroup (params, cb) {
  return api.post(mmsDomain.mms + '/testGroup/saveImportTestGroup.do', params, cb)
}
export function postSaveImportTestGroupdata (params, cb) {
  return api.post(mmsDomain.mms + '/testGroup/saveHandTestGroup.do', params, cb)
}
export function getSendList (callback) {
  const url = '/api/senddata?324'
  const data = {}

  return api.get(url, data, callback)
}
export function liveroomList (callback) {
  const url = '/api/liveroom?32224'
  const data = {}

  return api.get(url, data, callback)
}
export function effectTop (callback) {
  const url = '/api/effectTop?32224'
  const data = {}

  return api.get(url, data, callback)
}
export function effectList (callback) {
  const url = '/api/effectList?32224'
  const data = {}

  return api.get(url, data, callback)
}
/** 新建短信任务页面接口 start */
export function getMsgTemp (callback) {
  const url = '/api/getMsgTemp?32224'
  var data = {}

  return api.get(url, data, callback)
}
export function userGroup (callback) {
  const url = '/api/userGroup?32224'
  const data = {}

  return api.get(url, data, callback)
}
export function testGroup (callback) {
  const url = '/api/testGroup?32224'
  const data = {}

  return api.get(url, data, callback)
}
export function userGroupCount (data, callback) {
  const url = '/api/userGroupCount?32224'

  return api.get(url, data, callback)
}
export function testGroupCount (data, callback) {
  const url = '/api/testGroupCount?32224'

  return api.get(url, data, callback)
}
export function copyMsg (data, callback) {
  const url = '/api/copyMsg?32224'

  return api.get(url, data, callback)
}
/** 新建短信任务页面接口 end */
/** 回复短信记录页面接口 */
export function replyRecord (data, callback) {
  const url = '/api/replyRecord?32224'
  return api.get(url, data, callback)
}
/** 发送短信记录页面接口 */
export function sendRecord (data, callback) {
  const url = '/api/sendRecord?32224'
  return api.get(url, data, callback)
}
/** 短信模板页面接口 start */
export function tempList (data, callback) {
  const url = '/api/tempList?32224'
  return api.get(url, data, callback)
}
export function tempModify (data, callback) {
  const url = '/api/tempModify?32224'
  return api.get(url, data, callback)
}
export function tempDelete (data, callback) {
  const url = '/api/tempDelete?32224'
  return api.get(url, data, callback)
}
export function tempCreat (data, callback) {
  const url = '/api/tempCreat?32224'
  return api.get(url, data, callback)
}
/** 短信模板页面接口 end */
/** 短信任务管理页面接口 start */
export function msgManage (callback) {
  const url = '/api/msgManage?32224'
  var data = {}

  return api.get(url, data, callback)
}
export function msgDelete (callback) {
  const url = '/api/msgDelete?32224'
  var data = {}

  return api.get(url, data, callback)
}
/** 短信任务管理页面接口 end */
export function getTaskRef (callback) {
  const url = '/api/getTaskRef?32224'
  const data = {}

  return api.get(url, data, callback)
}
export function taskBase (callback) {
  const url = '/api/taskBase?32224'
  const data = {}

  return api.get(url, data, callback)
}
export function effectSingle (callback) {
  const url = '/api/effectSingle?32224'
  const data = {}

  return api.get(url, data, callback)
}
export function usernamecheckList (data, callback) { // 新建普通用户名验证
  const url = mmsDomain.mms + '/userGroup/validUserGroupName.do'

  return api.jsonp(url, data, callback)
}
export function normalusercountList (data, callback) { // 新建普通用户计算
  const url = mmsDomain.mms + '/userGroup/calculateNormalUserGroup.do'

  return api.post(url, data, callback)
}
export function userinfoList (data, callback) { // 新建普通用户保存
  const url = mmsDomain.mms + '/userGroup/saveNormalUserGroup.do'

  return api.post(url, data, callback)
}
export function catIdList (data, callback) { // 新建用户群-品类
  const url = mmsDomain.mms + '/userGroup/getCategoryList.do'

  return api.jsonp(url, data, callback)
}
export function brandList (data, callback) { // 新建用户群-品牌
  const url = mmsDomain.mms + '/userGroup/getBrandList.do'

  return api.post(url, data, callback)
}
export function cityList (data, callback) { // 新建城市数据
  const url = mmsDomain.mms + '/userGroup/getUserAddr.do'

  return api.jsonp(url, data, callback)
}
export function getUserManageList (data, callback) { // 用户群管理列表
  const url = mmsDomain.mms + '/userGroup/getUserGroupList.do'

  return api.jsonp(url, data, callback)
}
export function targetGroupList (data, callback) { // 新建复合群-目标群组
  const url = mmsDomain.mms + '/userGroup/getAllUserGroup.do'

  return api.jsonp(url, data, callback)
}
export function originGroupList (data, callback) { // 新建复合群-源群组
  const url = mmsDomain.mms + '/userGroup/getAllUserGroup.do'

  return api.jsonp(url, data, callback)
}
export function usercountList (data, callback) { // 新建复合群-计算
  const url = mmsDomain.mms + '/userGroup/calculateCompositeUserGroup.do'

  return api.jsonp(url, data, callback)
}
// export function btnokList (data, callback) { // 新建复合群-确定
//   const url = mmsDomain.mms + '/userGroup/saveCompositeUserGroup.do'

//   return api.post(url, data, callback)
// }
export function btnokList (params, cb) {
  return api.post(mmsDomain.mms + '/userGroup/saveCompositeUserGroup.do', params, cb)
}
export function deletemanageList (data, callback) { // 删除用户数据
  const url = mmsDomain.mms + '/userGroup/deleteUserGroup.do'

  return api.jsonp(url, data, callback)
}
export function exportOkList (data, callback) { // 导出成功
  const url = mmsDomain.mms + '/userGroup/exportUserGroupDataSet.do'

  return api.exportFile(url, data, callback)
}
export function exportErrList (data, callback) { // 导出失败
  const url = mmsDomain.mms + '/userGroup/exportUserGroupDataSet.do'

  return api.exportFile(url, data, callback)
}
export function exportGroupList (data, callback) { // 导入用户群
  const url = mmsDomain.mms + '/userGroup/saveImportUserGroup.do'
  return api.post(url, data, callback)
}
export function normalList (callback) { // 普通群编辑
  const url = '/api/normaldata?122'
  const data = {}

  return api.get(url, data, callback)
}
export function nomaleditList (data, callback) { // 普通用户群明细
  const url = mmsDomain.mms + '/userGroup/getUserGroupInfo.do'

  return api.jsonp(url, data, callback)
}
export function unnormalList (data, callback) { // 复合群明细
  const url = mmsDomain.mms + '/userGroup/getUserGroupInfo.do'

  return api.jsonp(url, data, callback)
}
// export function unnormalList (data, callback) { // 复合群明细 --本地测试
//   const url = '/api/unnormaldata?122'

//   return api.get(url, data, callback)
// }
export function updataserchList (data, callback) {
  // 更新
  const url = mmsDomain.mms + '/userGroup/updateUserGroup.do'
  return api.jsonp(url, data, callback)
}
export function userblackList (data, callback) { // 黑名单
  const url = mmsDomain.mms + '/blackUser/getBlackUserList.do'

  return api.jsonp(url, data, callback)
}
export function deleteuserblackList (data, callback) { // 删除黑名单
  const url = mmsDomain.mms + '/blackUser/deleteBlackUser.do'

  return api.get(url, data, callback)
}
// export function batchuploadList (data, callback) { // 黑名单-批量上传
//   const url = mmsDomain.mms + '/mms/blackUser/saveImportBlackUser.do'

//   return api.get(url, data, callback)
// }
export function handaddblackList (data, callback) { // 黑名单-手动添加
  const url = mmsDomain.mms + '/blackUser/saveHandBlackUser.do'

  return api.get(url, data, callback)
}
export function getGroupManageList (data, callback) { // 测试群管理
  const url = mmsDomain.mms + '/testGroup/getTestGroupList.do'

  return api.jsonp(url, data, callback)
}
export function getDeleteTestUser (data, callback) { // 编辑测试群 删除测试号
  const url = mmsDomain.mms + '/testGroup/deleteTestUser.do'

  return api.jsonp(url, data, callback)
}
export function getDeleteTestGroup (data, callback) { // 编辑测试群 删除列表按钮
  const url = mmsDomain.mms + '/testGroup/deleteTestGroup.do'

  return api.jsonp(url, data, callback)
}
export function getSaveHandTestGroupUser (data, callback) { // 编辑测试群 手动添加
  const url = mmsDomain.mms + '/testGroup/saveHandTestGroup.do'

  return api.jsonp(url, data, callback)
}
export function deleteTestGroupUser (data, callback) { // 编辑测试群 删除测试群组用户id
  const url = mmsDomain.mms + '/testGroup/deleteTestGroupUser.do'

  return api.jsonp(url, data, callback)
}
export function getEditManageList (data, callback) { // 测试群--编辑--列表
  const url = mmsDomain.mms + '/testGroup/getTestGroupUserList.do'

  return api.jsonp(url, data, callback)
}
export function saveImportTestGroupUser (data, callback) { // 编辑测试群 批量导入用户群组
  const url = mmsDomain.mms + '/testGroup/saveImportTestGroupUser.do'

  return api.jsonp(url, data, callback)
}
export function testGroupcheckList (data, callback) { // 编辑测试群 批量导入用户群组--名称验证
  const url = mmsDomain.mms + '/testGroup/validTestGroupName.do'

  return api.jsonp(url, data, callback)
}
export function editSaveHandTestGroupUser (data, callback) { // 编辑测试群 手动添加
  const url = mmsDomain.mms + '/testGroup/saveHandTestGroupUser.do'

  return api.jsonp(url, data, callback)
}
export function userpageAuthorized (data, callback) { // 用户权限
  const url = mmsDomain.mms + '/authorize/pageAuthorized.do'
  return api.jsonp(url, data, callback)
}