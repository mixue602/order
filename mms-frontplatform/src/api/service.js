import Api from 'api/api'
let api = new Api()

export function postUrl (params, cb) {
  return api.post('info/CarSource/release', params, cb)
}
export function postSaveHandTestGroup (params, cb) {
  return api.post('info/CarSource/release', params, cb)
}
export function postSaveImportTestGroupdata (params, cb) {
  return api.post('testGroup/saveImportTestGroup.do', params, cb)
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
export function getGroupManageList (data, callback) {
  const url = '/api/groupManage?802'

  return api.get(url, data, callback)
}
export function usernamecheckList (data, callback) { // 新建普通用户名验证
  const url = '/api/usernamecheck?122'

  return api.get(url, data, callback)
}
export function normalusercountList (data, callback) { // 新建普通用户计算
  const url = '/api/userinfocount?122'

  return api.get(url, data, callback)
}
export function userinfoList (data, callback) { // 新建普通用户保存
  const url = '/api/userinfosend?122'

  return api.get(url, data, callback)
}
export function nomaleditList (callback) { // 普通用户群编辑
  const url = '/api/nomalusereditdata?122'
  const data = {}

  return api.get(url, data, callback)
}
export function brandList (callback) { // 新建用户群品牌
  const url = '/api/brandlistdata?122'
  const data = {}

  return api.get(url, data, callback)
}
export function cityList (callback) { // 新建城市数据
  const url = '/api/citylistdata?122'
  const data = {}

  return api.get(url, data, callback)
}
export function deletemanageList (data, callback) { // 删除用户数据
  const url = '/api/deletemanagelist?122'

  return api.get(url, data, callback)
}
export function exportOkList (data, callback) { // 导出成功
  const url = '/api/exportOk?122'

  return api.get(url, data, callback)
}
export function exportErrList (data, callback) { // 导出失败
  const url = '/api/exportErr?122'

  return api.get(url, data, callback)
}
export function getUserManageList (data, callback) { // 用户群管理
  const url = '/api/usergroupmanagedata?122'

  return api.get(url, data, callback)
}
export function getEditManageList (data, callback) { // 编辑测试群
  const url = '/api/editgroupmanagedata?122'

  return api.get(url, data, callback)
}
export function targetGroupList (callback) { // 新建复合群下拉框数据
  const url = '/api/targetgroupdata?122'
  const data = {}

  return api.get(url, data, callback)
}
export function usercountList (callback) { // 计算
  const url = '/api/usercountdata?122'
  const data = {}

  return api.get(url, data, callback)
}
export function normalList (callback) { // 普通群明细
  const url = '/api/normaldata?122'
  const data = {}

  return api.get(url, data, callback)
}
export function unnormalList (callback) { // 复合群明细
  const url = '/api/unnormaldata?122'
  const data = {}

  return api.get(url, data, callback)
}
export function updataserchList (data, callback) { // 更新
  const url = '/api/updataserch?122'

  return api.get(url, data, callback)
}
export function userblackList (data, callback) { // 黑名单
  const url = '/api/userblackdata?122'

  return api.get(url, data, callback)
}
export function deleteuserblackList (data, callback) { // 删除黑名单
  const url = '/api/deletuserblacklist?122'

  return api.get(url, data, callback)
}
export function batchuploadList (data, callback) { // 批量上传
  const url = '/api/deletuserblacklist?122'

  return api.get(url, data, callback)
}
export function handaddblackList (data, callback) { // 手动添加
  const url = '/api/deletuserblacklist?122'

  return api.get(url, data, callback)
}
export function getDeleteTestUser (data, callback) { // 编辑测试群 删除测试号
  const url = '/api/deleteTestUserdata?122'

  return api.get(url, data, callback)
}
export function getDeleteTestGroup (data, callback) { // 编辑测试群 删除测试群
  const url = '/api/deleteTestGroupdata?122'

  return api.get(url, data, callback)
}
export function getSaveHandTestGroupUser (data, callback) { // 编辑测试群 手动添加
  const url = '/api/saveHandTestGroupUserdata?122'

  return api.get(url, data, callback)
}
export function deleteTestGroupUser (data, callback) { // 编辑测试群 删除测试群组用户id
  const url = '/api/deleteTestGroupUserdata?122'

  return api.get(url, data, callback)
}
export function saveImportTestGroupUser (data, callback) { // 编辑测试群 批量导入用户群组
  const url = '/api/saveImportTestGroupUserdata?122'

  return api.get(url, data, callback)
}
