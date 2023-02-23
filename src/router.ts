import {createRouter, RouteRecordRaw, Router, createWebHistory} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('./components/Home.vue'),
        meta: {
            title: 'Project BS 防灾企划'
        }
    },
    {
        path: '/ceiv2closetest',
        name: 'Ceiv2closetest',
        component: () => import('./components/Ceiv2closetest.vue'),
        meta: {
            title: 'Project BS 防灾企划'
        }
    },
    {
        path: '/:pathMatch(.*)',
        component: () => import('./components/404.vue'),
        meta: {
            title: '404 - Project BS'
        }
    }
]

const router: Router = createRouter({
    history: createWebHistory(),
    routes
})

export default router