import axios from 'axios/dist/axios.min'

let base = process.env.API_ROOT
// 获取登录用户的权限
export const userprivileges = params => {
  return axios.post(`${base}/user/queryPermission`, JSON.stringify(params)).then(res => res.data)
}
