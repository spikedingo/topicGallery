import request from '@root/publicMethods/request'

export function topicCategoryList(params) {
  return request({
    url: '/manage/topicCategory/getList',
    params,
    method: 'get'
  })
}

export function getOneTopicCategory(params) {
  return request({
    url: '/manage/topicCategory/getOne',
    params,
    method: 'get'
  })
}

export function addTopicCategory(data) {
  return request({
    url: '/manage/topicCategory/addOne',
    data,
    method: 'post'
  })
}

export function updateTopicCategory(data) {
  return request({
    url: '/manage/topicCategory/updateOne',
    data,
    method: 'post'
  })
}

export function deleteTopicCategory(params) {
  return request({
    url: '/manage/topicCategory/deleteCategory',
    params,
    method: 'get'
  })
}