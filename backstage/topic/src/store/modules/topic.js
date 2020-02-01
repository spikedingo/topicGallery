import * as types from '../types.js';
import {
  topicList,
  getOneTopic
} from '@/api/topic';
import _ from 'lodash';


const state = {
  formState: {
    edit: false,
    formData: {
      type: '1',
      state: '2',
      title: '',
      categories: ["DUH4m6Ut", "hlAEiR_k"],
      keywords: '',
      sortPath: '',
      keywords: '',
      discription: '',
      rank: 3,
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
  topicList: {
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
  [types.TOPIC_FORMSTATE](state, formState) {
    state.formState.edit = formState.edit;
    state.formState.formData = Object.assign({
      type: '1',
      state: '2',
      title: '',
      categories: ["DUH4m6Ut", "hlAEiR_k"],
      keywords: '',
      sortPath: '',
      keywords: '',
      discription: '',
      rank: 3,
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
  [types.TOPIC_LIST](state, topicList) {
    state.topicList = topicList
  },
  [types.TOPIC_ONE](state, topic) {
    state.topic = topic
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

  showTopicForm: ({
    commit
  }, params = {
    edit: false,
    formData: {}
  }) => {
    commit(types.TOPIC_FORMSTATE, {
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
  getTopicList({
    commit
  }, params = {}) {
    topicList(params).then((result) => {
      commit(types.TOPIC_LIST, result.data)
    })
  },

  getOneTopic({
    commit
  }, params = {}) {
    getOneTopic(params).then((result) => {
      commit(types.TOPIC_ONE, result.data)
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}