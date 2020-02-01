import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import topic from './modules/topic'
import node from './modules/node'
import topicCategory from './modules/topicCategory'
// import contentTag from './modules/contentTag'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    topic,
    topicCategory,
    node,
    // contentTag
  },
  getters
})

export default store