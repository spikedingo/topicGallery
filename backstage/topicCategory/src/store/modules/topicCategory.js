import * as types from '../types.js';
import {
  topicCategoryList,
} from '@/api/topicCategory';
import _ from 'lodash';
import {
  renderTreeData
} from '@/utils';

const state = {
  formState: {
    type: 'root',
    show: false,
    edit: false,
    formData: {
      label: '',
      enable: true,
      defaultUrl: '',
      parentId: '',
      parentObj: '',
      sortId: 0,
      comments: '',
      type: '1',
      sImg: '',
    }
  },
  categoryList: {
    pageInfo: {},
    docs: []
  },
}

const mutations = {
  [types.TOPICCATEGORYS_FORMSTATE](state, formState) {
    state.formState.show = formState.show;
    state.formState.edit = formState.edit;
    state.formState.type = formState.type;
    state.formState.formData = Object.assign({
      name: '',
      enable: true,
      defaultUrl: '',
      parentId: '',
      parentObj: {},
      sortId: 0,
      comments: '',
      type: '1',
      sImg: ''
    }, formState.formData);

  },
  [types.TOPICCATEGORYS_LIST](state, categoryList) {
    state.categoryList = categoryList
  },
}

const actions = {

  showTopicCategoryForm: ({
    commit
  }, params = {
    type: 'root',
    edit: false,
    formData: {}
  }) => {
    commit(types.TOPICCATEGORYS_FORMSTATE, {
      show: true,
      type: params.type,
      edit: params.edit,
      formData: params.formData
    })
  },
  hideTopicCategoryForm: ({
    commit
  }) => {
    commit(types.TOPICCATEGORYS_FORMSTATE, {
      show: false
    })
  },
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
