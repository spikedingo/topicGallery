import * as types from '../types.js';
import {
  nodeList,
  getOneNode
} from '@/api/node';
import _ from 'lodash';


const state = {
  formState: {
    edit: false,
    formData: {
      type: '1',
      state: '2',
      title: '',
      categories: [],
      keywords: '',
      sortPath: '',
      // tags: [],
      keywords: '',
      discription: '',
      rank: 1,
      content: '',
      puzzleContent: '',
      // targetUser: '',
      // author: {},
      // uAuthor: '',
      isTop: 0,
      roofPlacement: '0',
      clickNum: 0,
      // comments: '',
      // simpleComments: '',
      commentNum: 0,
      likeNum: 0,
      dismissReason: '',
    }
  },
  nodeList: {
    pageInfo: {},
    docs: []
  },
  directUser: {
    formState: {
      show: false,
      edit: false,
      formData: {
        name: '',
        alias: '',
        targetUser: ''
      }
    }
  },
}

const mutations = {
  [types.NODE_FORMSTATE](state, formState) {
    state.formState.edit = formState.edit;
    state.formState.formData = Object.assign({
      type: '1',
      state: '2',
      title: '',
      categories: [],
      keywords: '',
      sortPath: '',
      // tags: [],
      keywords: '',
      discription: '',
      rank: 1,
      content: '',
      puzzleContent: '',

      // targetUser: '',
      // author: {},
      // uAuthor: '',
      isTop: 0,
      roofPlacement: '0',
      clickNum: 0,
      // comments: '',
      // simpleComments: '',
      commentNum: 0,
      likeNum: 0,
      dismissReason: '',
    }, formState.formData);

  },
  [types.NODE_LIST](state, nodeList) {
    state.nodeList = nodeList
  },
  [types.NODE_ONE](state, node) {
    state.node = node
  },
  [types.DIRECTUSERFORMSTATE](state, formState) {
    state.directUser.formState.show = formState.show;
    state.directUser.formState.edit = formState.edit;
    state.directUser.formState.type = formState.type;
    state.directUser.formState.formData = Object.assign({
      name: '',
      alias: '',
      targetUser: ''
    }, formState.formData);
  },
}

const actions = {

  showNodeForm: ({
    commit
  }, params = {
    edit: false,
    formData: {}
  }) => {
    commit(types.NODE_FORMSTATE, {
      edit: params.edit,
      formData: params.formData
    })
  },
  showDirectUserForm: ({
    commit
  }, params = {
    edit: false,
    formData: {}
  }) => {
    commit(types.DIRECTUSERFORMSTATE, {
      show: true,
      edit: params.edit,
      formData: params.formData
    })
  },
  hideDirectUserForm: ({
    commit
  }) => {
    commit(types.DIRECTUSERFORMSTATE, {
      show: false
    })
  },
  getNodeList({
    commit
  }, params = {}) {
    nodeList(params).then((result) => {
      commit(types.NODE_LIST, result.data)
    })
  },

  getOneNode({
    commit
  }, params = {}) {
    getOneNode(params).then((result) => {
      commit(types.NODE_ONE, result.data)
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}