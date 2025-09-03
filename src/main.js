import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'

import './style.css'
import Home from "@/components/home/Home.vue";
import View from "@/components/view/View.vue";

const pinia = createPinia();

const app = createApp(App)
    .use(pinia);

const routes = [ { path: '/', component: Home }, { path: '/view', component: View }, {
    path: '/info',
    component: () => import('@/components/info/Info.vue')
}, ]

const router = createRouter({
    history: createWebHistory(), routes,
});

router.beforeEach((to, from, next) => {
    if ( to.path === '/view' ) {
        import('./stores/audioStore.js').then(({ useAudioStore }) => {
            const audioStore = useAudioStore();
            if ( !audioStore.file ) {
                console.error("No audio file selected, redirecting to home.");
                next('/');
            } else {
                next();
            }
        });
        return;
    }
    next()
})

app.use(router)
    .mount('#app')
