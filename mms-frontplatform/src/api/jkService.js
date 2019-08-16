import { mmsDomain } from 'api/config'
import Api from 'api/api'
let api = new Api()

/** 集客概论 start */
export function queryStatisticalList (data, callback) {
  // const url = mmsDomain.jk + '/api/statistical'
  const url = mmsDomain.jk + '/statistical/list'
  return api.jsonp(url, data, callback)
}

export function activeDeployList (data, callback) { // 领券
  const url = mmsDomain.jk + '/activity/couponEffect'
  return api.jsonp(url, data, callback)
}

export function activeDeployTableList (data, callback) { // 领券
  const url = mmsDomain.jk + '/activity/list'
  return api.jsonp(url, data, callback)
}
/** 集客概论 end */
export function queryArea (data, callback) {
  // const url = mmsDomain.jk + '/api/area'
  const url = mmsDomain.jk + '/area/getRegionals'
  return api.jsonp(url, data, callback)
}
export function queryCity (data, callback) {
  // const url = mmsDomain.jk + '/api/city'
  const url = mmsDomain.jk + '/area/getDivisions'
  return api.jsonp(url, data, callback)
}
export function queryStore (data, callback) {
  // const url = mmsDomain.jk + '/api/store'
  const url = mmsDomain.jk + '/area/getStores'
  return api.jsonp(url, data, callback)
}
export function queryEmploy (data, callback) {
  // const url = mmsDomain.jk + '/api/person'
  const url = mmsDomain.jk + '/area/getEmploys'
  return api.jsonp(url, data, callback)
}
export function jurisdiction (data, callback) {
  // const url = mmsDomain.jk + '/api/power'
  const url = mmsDomain.jk + '/jurisdiction/list'
  return api.jsonp(url, data, callback)
}
