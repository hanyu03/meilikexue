import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/resource/Home'


Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name:'home',
      component: Home
    },
    {
      path: '/media',
      name: 'media',
      component: Home
    }
  ]
})
