import Vue from 'vue'
import Router from 'vue-router'
import settings from "@root/publicMethods/settings";
import Topic from '@/views/topic'

Vue.use(Router)

const createRouter = () => new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [{
    path: settings.admin_base_path + '/topic',
    name: 'topic',
    component: Topic
  }, {
    path: settings.admin_base_path + '/topic/addTopic',
    name: 'addTopic',
    component: () => import( /* webpackChunkName: "addTopic" */ '@/views/topic/topicForm.vue')
  }, {
    path: settings.admin_base_path + '/topic/editTopic/:id',
    name: 'editTopic',
    component: () => import( /* webpackChunkName: "editTopic" */ '@/views/topic/topicForm.vue')
  }]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router