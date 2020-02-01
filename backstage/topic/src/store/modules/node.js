import * as types from '../types.js';
import {
  nodeList,
  getOneNode
} from '@/api/node';
import _ from 'lodash';


const state = {
  formState: {
    visible: false,
    edit: false,
    formData: {
      type: '1',
      state: '2',
      title: '',
      categories: [],
      keywords: '',
      sortPath: '',
      keywords: '',
      discription: '',
      rank: 1,
      content: '',
      puzzleContent: '',
      isTop: 0,
      roofPlacement: '0',
      clickNum: 0,
      commentNum: 0,
      likeNum: 0,
      dismissReason: '',
    }
  },
  nodeList: {
    pageInfo: {},
    docs: []
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
      keywords: '',
      discription: '',
      rank: 1,
      content: '',
      puzzleContent: '',
      isTop: 0,
      roofPlacement: '0',
      clickNum: 0,
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
  [types.ADDNODEFORMSTATE](state, formState) {
    state.formState.visible = formState.visible;
    state.formState.edit = formState.edit;
    state.formState.type = formState.type;
    state.formState.formData = Object.assign({
        type: '1',
        state: '2',
        title: '这是标题',
        categories: [],
        keywords: ['节点'],
        sortPath: '',
        discription: '介绍',
        rank: 1,
        content: '这是一段节点正文',
        puzzleContent: '这是一段{ 1 }正文',
        isTop: 0,
        roofPlacement: '0',
        clickNum: 0,
        commentNum: 0,
        likeNum: 0,
        dismissReason: '',
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
  showAddNodeForm: ({
    commit
  }, params = {
    edit: false,
    formData: {}
  }) => {
    console.log(12345)
    commit(types.ADDNODEFORMSTATE, {
      visible: true,
      edit: params.edit,
      formData: params.formData
    })
  },
  hideAddNodeForm: ({
    commit
  }) => {
    commit(types.ADDNODEFORMSTATE, {
      visible: false,
      edit: false,
      formData: {}
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