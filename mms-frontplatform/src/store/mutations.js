import * as types from './mutation-types'

const mutations = {
  [types.SET_TASKID] (state, taskId) {
    state.taskId = taskId
  },
  [types.SET_MSGTEMPLETID] (state, msgTempletId) {
    state.msgTempletId = msgTempletId
  },
  [types.SET_MSGOPERATE] (state, msgOperate) {
    state.msgOperate = msgOperate
  },
  [types.SET_TID] (state, tId) {
    state.tId = tId
  },
  [types.SET_GROUPMANAGEID] (state, GroupmanageId) {
    state.GroupmanageId = GroupmanageId
  },
  [types.SET_NORMALGEDITID] (state, NormalGEditId) {
    state.NormalGEditId = NormalGEditId
  },
  [types.SET_NORMALGEDITIDTYPE] (state, NormalGEditIdType) {
    state.NormalGEditIdType = NormalGEditIdType
  }
}

export default mutations
