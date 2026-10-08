import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TimeMachineView from '@/views/TimeMachineView.vue'
import ProjectDetailView from '@/views/ProjectDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: 'Fero Fasya - Links' }
  },
  {
    path: '/mesin-waktu',
    name: 'TimeMachine',
    component: TimeMachineView,
    meta: { title: 'Mesin Waktu Fero ⏳' }
  },
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: ProjectDetailView,
    meta: { title: 'Project Detail | Fero Fasya' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
