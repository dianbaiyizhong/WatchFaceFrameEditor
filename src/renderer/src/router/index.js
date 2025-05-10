// router/index.js
import {createRouter, createWebHistory} from 'vue-router';
import App from '../App.vue';
import Handler from '../Handler.vue';

const routes = [
    {
        path: '/',
        name: 'App',
        component: App,
    },
    {
        path: '/handler',
        name: 'Handler',
        component: Handler,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;