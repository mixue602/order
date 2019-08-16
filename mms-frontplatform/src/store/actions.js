import * as types from './mutation-types'

export const copyMsg = function ({commit}, taskId) { // 复制短信任务
  commit(types.SET_TASKID, taskId)
  commit(types.SET_MSGOPERATE, 'copy')
}
export const editMsg = function ({commit}, taskId) { // 编辑短信任务
  commit(types.SET_TASKID, taskId)
  commit(types.SET_MSGOPERATE, 'edit')
}
export const TGEdit = function ({commit}, GroupmanageId) { // 测试群管理编辑
  commit(types.SET_GROUPMANAGEID, GroupmanageId)
}
export const normalGpEdit = function ({commit}, NormalGEditId) { // 普通用户群编辑
  commit(types.SET_NORMALGEDITID, NormalGEditId)
}
export const normalGpEditType = function ({commit}, NormalGEditIdType) { // 测试群管理编辑
  commit(types.SET_NORMALGEDITIDTYPE, NormalGEditIdType === 2 ? 'Import' : '')
}
export const emptyAll = function ({commit}, NormalGEditIdType) { // 清空新建短信页面所有值
  commit(types.SET_TASKID, '')
  commit(types.SET_MSGOPERATE, '')
  commit(types.SET_MSGTEMPLETID, '')
  commit(types.SET_NORMALGEDITID, '')
  commit(types.SET_NORMALGEDITIDTYPE, '')
}
