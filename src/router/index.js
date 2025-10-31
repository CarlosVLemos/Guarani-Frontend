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
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/Projects.vue'),
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
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } // Rota protegida
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard genérico para rotas protegidas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {

    next({ name: 'Home' });
    
  } else {
    next();
  }
});

export default router;