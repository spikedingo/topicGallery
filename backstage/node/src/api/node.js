import request from '@root/publicMethods/request'


export function redictNodeToUsers(data) {
  return request({
    url: '/manage/node/redictNodeToUsers',
    data,
    method: 'post'
  })
}

export function nodeList(params) {
  return request({
    url: '/manage/node/getList',
    params,
    method: 'get'
  })
}

export function getOneNode(params) {
  return request({
    url: '/manage/node/getNode',
    params,
    method: 'get'
  })
}

export function addNode(data) {
  return request({
    url: '/manage/node/addOne',
    data,
    method: 'post'
  })
}

export function updateNode(data) {
  return request({
    url: '/manage/node/updateOne',
    data,
    method: 'post'
  })
}

export function updateNodeToTop(data) {
  return request({
    url: '/manage/node/topNode',
    data,
    method: 'post'
  })
}

export function roofNode(data) {
  return request({
    url: '/manage/node/roofNode',
    data,
    method: 'post'
  })
}

export function deleteNode(params) {
  return request({
    url: '/manage/node/deleteNode',
    params,
    method: 'get'
  })
}

export function getRandomNodeImg(params) {
  return request({
    url: '/api/node/getRandomNodeImg',
    params,
    method: 'get'
  })
}

export function regUserList(params) {
  return request({
    url: '/manage/regUser/getList',
    params,
    method: 'get'
  })
}