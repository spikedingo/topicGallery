import request from '@root/publicMethods/request'



export function topicCategoryList(params) {
  return request({
    url: '/manage/topicCategory/getList',
    params,
    method: 'get'
  })
}
