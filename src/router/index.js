import Vue from "vue";
import VueRouter from "vue-router";
// import { isLooseLoggedIn, isAccountLoggedIn } from "@/utils/auth";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/home.vue'),
        meta: {
            keepAlive: true,
            savePosition: true,
        },
    },
    {
        path: '/playlist/:id',
        name: 'playlist',
        component: () => import('@/views/playlist.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login.vue'),
    },
    {
        path: '/login/account',
        name: 'loginAccount',
        component: () => import('@/views/loginAccount.vue'),
    }
];

const router = new VueRouter({
    mode: process.env.IS_ELECTRON ? 'hash' : 'history',
    routes,
});

export default router;