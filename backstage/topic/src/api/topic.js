import request from '@root/publicMethods/request'


export function redictTopicToUsers(data) {
  return request({
    url: '/manage//redictTopicToUsers',
    data,
    method: 'post'
  })
}

export function topicList(params) {
  return request({
    url: '/manage/topic/getList',
    params,
    method: 'get'
  })
}

export function getOneTopic(params) {
  return request({
    url: '/manage/topic/getTopic',
    params,
    method: 'get'
  })
}

export function addTopic(data) {
  return request({
    url: '/manage/topic/addOne',
    data,
    method: 'post'
  })
}

export function updateTopic(data) {
  return request({
    url: '/manage/topic/updateOne',
    data,
    method: 'post'
  })
}

export function updateTopicToTop(data) {
  return request({
    url: '/manage/topic/topTopic',
    data,
    method: 'post'
  })
}

export function roofTopic(data) {
  return request({
    url: '/manage/topic/roofTopic',
    data,
    method: 'post'
  })
}

export function deleteTopic(params) {
  return request({
    url: '/manage/topic/deleteTopic',
    params,
    method: 'get'
  })
}

export function getRandomTopicImg(params) {
  return request({
    url: '/api/topic/getRandomTopicImg',
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