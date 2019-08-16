import Api from 'api/api'
let api = new Api()

export function getSendList (callback) {
  const url = '/api/senddata?324'
  const data = {}

  return api.get(url, data, callback)
}
