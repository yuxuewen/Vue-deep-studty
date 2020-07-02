
import Vue from 'vue'
import Router from './vue-router'
import Home from '../components/Home.vue'
import Hello from '../components/HelloWorld.vue'
console.log(Router);
const routes = [

    {
        path: '/home',
        name: 'stereotype',
        title: '首页',
        component: Home,

    },
    {
        path: '/hello',
        name: 'hello',
        title: '你好',
        component: Hello,

    },
]
Vue.use(Router);

const router=new Router({
      mode:'history',
      routes

});

export default router;
