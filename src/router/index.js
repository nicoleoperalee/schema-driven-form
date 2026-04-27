import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Demo from '@/views/Demo.vue'
import Playground from '@/views/Playground.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/demo', component: Demo },
    { path: '/playground', component: Playground },
  ],
})

export default router
