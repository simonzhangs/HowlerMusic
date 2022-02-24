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
    }
];

const router = new VueRouter({
    mode: process.env.IS_ELECTRON ? 'hash' : 'history',
    routes,
});

export default router;