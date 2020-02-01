import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import topicCategory from './modules/topicCategory'
import topicTemplate from './modules/topicTemplate'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    topicCategory,
    topicTemplate
  },
  getters
})

export default store