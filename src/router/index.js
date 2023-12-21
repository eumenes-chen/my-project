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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Weight.vue')
    },
    {
      path: '/sanguo',
      name: 'sanguo',
      component: () => import('../views/Sanguo/index.vue')
    },
    {
      path: '/iframe',
      name: 'iframe',
      component: () => import('../views/Iframe/index.vue')
    },
  ]
})

export default router
