import Vue from 'vue'
import Router from 'vue-router'
import Browser from '@/components/Browser'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Default',
      component: Browser
    },
    {
      path: '/browser',
      name: 'Browser',
      component: Browser
    }
  ]
})
