import {createRouter, createWebHistory} from 'vue-router';
import Login from '../views/Login.vue';
import registrarUsuario from '../views/Register.vue';
import Dashboard from '../views/dashboard.vue';

const routes = [
    {
        path: '/', redirect: '/login'
    },
    {
        path: '/login', component: Login
    },
    {
        path: '/register', component: registrarUsuario
    },
    {
        path: '/dashboard', component: Dashboard, meta: {requiresAuth: true}
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})