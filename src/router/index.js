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
      component: () => import('../views/Calendar/index.vue'),
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
