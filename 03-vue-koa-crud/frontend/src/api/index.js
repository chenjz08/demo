import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 获取列表
export function getItems(params) {
  return api.get('/items', { params })
}

// 获取单个
export function getItem(id) {
  return api.get(`/items/${id}`)
}

// 新增
export function createItem(data) {
  return api.post('/items', data)
}

// 修改
export function updateItem(id, data) {
  return api.put(`/items/${id}`, data)
}

// 删除
export function deleteItem(id) {
  return api.delete(`/items/${id}`)
}

export default api
