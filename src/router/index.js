import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue'; 
import { useAuthStore } from '../store/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login/:userType',
    name: 'Login',
    // Lazy load o componente do formulário
    component: () => import('../components/forms/LoginForm.vue'),
    props: true // Passa os parâmetros da rota (userType) como props para o componente
  },
  {
    path: '/register/:userType',
    name: 'Register',
    // Lazy load o componente do formulário
    component: () => import('../components/forms/RegisterForm.vue'),
    props: true // Passa os parâmetros da rota (userType) como props para o componente
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    // meta: { requiresAuth: true } // Rota protegida
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// // Guard genérico para rotas protegidas
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();
//   if (to.meta.requiresAuth && !authStore.user) {
//     next({ name: 'Login', params: { userType: 'comprador' } });
//   } else {
//     next();
//   }
// });

export default router;