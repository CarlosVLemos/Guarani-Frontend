import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue'; 
import { useAuthStore } from '../store/auth';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/Projects.vue'),
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetails',
    component: () => import('../views/ProjectDetails.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:id/edit',
    name: 'EditProject',
    component: () => import('../views/EditProject.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('../views/Transactions.vue'),
  },
  {
    path: '/me',
    name: 'Me',
    component: () => import('../views/Me.vue'),
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('../views/Logout.vue'),
  },
  {
    path: '/login/:userType?',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register/:userType?',
    name: 'Register',
    // Lazy load o componente do formulário
    component: () => import('../components/forms/RegisterForm.vue'),
    props: true // Passa os parâmetros da rota (userType) como props para o componente
  },
  {
    path: '/create-project',
    name: 'CreateProject',
    component: () => import('../views/CreateProject.vue'),
    meta: { 
      requiresAuth: true,
      allowedUsers: ['comprador']
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { 
      requiresAuth: true,
      allowedUsers: ['comprador', 'ofertante'] 
    } // Rota protegida
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard genérico para rotas protegidas
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Espera a promessa de autenticação inicial ser resolvida
  await authStore.initialAuthPromise;

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Se a rota exige autenticação e o usuário não está logado, redireciona para Home.
    next({ name: 'Home' });
  } else if (to.meta.allowedUsers && !to.meta.allowedUsers.includes(authStore.user?.user_type.toLowerCase())) {
    // Se o usuário está logado mas não tem permissão, redireciona para Home.
    next({ name: 'Home' });
  } else {
    // Permite o acesso.
    next();
  }
});

export default router;