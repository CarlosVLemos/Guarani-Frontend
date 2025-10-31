import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login/:userType?',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register/:userType?',
    name: 'Register',
    component: Register,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true, requiresAdmin: true } // Exemplo de meta fields
  },
  {
    path: '/project/:id',
    name: 'ProjectDetails',
    component: () => import('../views/ProjectDetails.vue'),
    meta: { requiresAuth: true } // Exemplo de meta fields
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;