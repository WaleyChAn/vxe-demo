import axios from 'axios'

export function getBigTree (query) {
  // 虚拟异步数据，正常直接返回请求内容即可
  return axios.get('../../static/data/big-tree.json')
}

export function getBigTree2 (query) {
  // 虚拟异步数据，正常直接返回请求内容即可
  return axios.get('../../static/data/big-tree2.json')
}
