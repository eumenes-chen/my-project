import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      redirect:'/home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/weight',
      name: 'weight',
      component: () => import('../views/Weight/index.vue')
    },
    {
      path: '/sanguo',
      name: 'sanguo',
      component: () => import('../views/Sanguo/index.vue')
    },
    {
      path: '/calendar',
      name: 'calendar',
      redirect:'/calendar/table',
      component: () => import('../views/Calendar/index.vue'),
      children:[
        {
          path: 'table',
          name: 'table',
          component: () => import('../views/Calendar/table.vue'),
        },
        {
          path: 'timeline',
          name: 'timeline',
          component: () => import('../views/Calendar/timeline.vue'),
        },
        {
          path: 'chart',
          name: 'chart',
          component: () => import('../views/Calendar/chart.vue'),
        },
      ]
    },
    {
      path: '/iframe',
      name: 'iframe',
      component: () => import('../views/Iframe/index.vue')
    },
    {
      path: '/manage',
      name: 'manage',
      component: () => import('../views/Manage/index.vue')
    },
  ]
})

export default router
