import { createRouter, createWebHistory } from 'vue-router';
import routes from '@/router/routes.js';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard', // Redireciona a rota padrão para uma rota autenticada
      meta: {
        auth: true
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
        auth: true,
        grants: ['admin']
      }
    },
    {
      path: '/meusChamados',
      name: 'meusChamados',
      component: () => import('../views/Chamados.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/chamadosTecnicos',
      name: 'chamadosTecnicos',
      component: () => import('../views/Chamados.vue'),
      meta: {
        auth: true,
        grants: ['admin', 'supervisor', 'analista', 'tecnico']
      }
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: () => import('../views/Usuarios.vue'),
      meta: {
        auth: true,
        grants: ['admin', 'supervisor', 'analista', 'tecnico']
      }
    },
    {
      path: '/setores',
      name: 'setores',
      component: () => import('../views/Setores.vue'),
      meta: {
        auth: true,
        grants: ['admin', 'supervisor', 'analista', 'tecnico']
      }
    },
    {
      path: '/cargos',
      name: 'cargos',
      component: () => import('../views/Cargos.vue'),
      meta: {
        auth: true,
        grants: ['admin', 'supervisor', 'analista', 'tecnico']
      }
    },
    {
      path: '/categoria',
      name: 'categoria',
      component: () => import('../views/Categoria.vue'),
      meta: {
        auth: true,
        grants: ['admin', 'supervisor', 'analista', 'tecnico']
      }
    },
    {
      path: '/naoPermitido',
      name: 'naoPermitido',
      component: () => import('../views/naoPermitido.vue'),
      meta: {
        auth: true
      }
    }
  ]
});

router.beforeEach(routes);

export default router;
