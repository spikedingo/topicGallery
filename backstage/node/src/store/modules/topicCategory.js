import * as types from '../types.js';
import {
  topicCategoryList
} from '@/api/topicCategory';
import _ from 'lodash';
import {
  renderTreeData
} from '@/utils';


const state = {
  categoryList: {
    pageInfo: {},
    docs: []
  },
}

const mutations = {
  [types.TOPICCATEGORYS_LIST](state, categoryList) {
    state.categoryList = categoryList
  },
}

const actions = {

  getTopicCategoryList({
    commit
  }, params = {}) {
    topicCategoryList(params).then((result) => {
      let treeData = renderTreeData({
        docs: result.data
      });
      commit(types.TOPICCATEGORYS_LIST, treeData)
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}