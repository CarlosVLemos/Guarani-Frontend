import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;