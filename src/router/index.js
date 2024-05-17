import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes.js';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        auth:true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        auth:true,
        grants: [
          'admin'
        ]
      }
    },
    {
      path: '/meusChamados',
      name: 'meusChamados',
      component: () => import('../views/MeusChamados.vue'),
      meta: {
        auth:true
      }
    },
    {
      path: '/chamadosTecnicos',
      name: 'chamadosTecnicos',
      component: () => import('../views/chamadosTecnicos.vue'),
      meta: {
        auth:true,
        grants: [
          'admin',
          'supervisor',
          'analista',
          'tecnico'
        ]
      }
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: () => import('../views/Usuarios.vue'),
      meta: {
        auth:true,
        grants: [
          'admin',
          'supervisor',
          'analista',
          'tecnico'
        ]
      }
    },
    {
      path: '/naoPermitido',
      name: 'naoPermitido',
      component: () => import('../views/naoPermitido.vue'),
      meta: {
        auth:true
      }
    }
  ]
})

router.beforeEach(routes);

export default router