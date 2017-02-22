import Vue from 'vue'
import App from './App.vue'
import LogIn from './components/LogIn.vue'
import StudyList from './components/StudyList.vue'
import CreateOne from './components/CreateOne.vue'
import DeleteStudy from './components/DeleteStudy.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import store from './store'
import VueSelect from 'vue-select'
import Settings from './components/Settings.vue'
import Cache from './components/Cache.vue'
import Toastr from 'vue-toastr';
import Modal from './components/Modal.vue';
import Vuelidate from 'vuelidate'

require('vue-toastr/src/vue-toastr.less');
require('../static/favicon.ico');

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vuelidate)
Vue.component('v-select', VueSelect)
Vue.component('vue-toastr', Toastr);
Vue.component('modal', Modal);

export var router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        { path: '/', component: LogIn },
        { path: '/login', component: LogIn },
        { path: '/study-list', component: StudyList,
            children: [
                { path: 'create-one', component: CreateOne },
                { path: 'delete-study', component: DeleteStudy }
            ]},
        { path: '/settings', component: Settings },
        { path: '/cache', component: Cache },
        { path: '*', redirect: '/' }
    ]
})

router.beforeEach(({meta, path}, from, next) => {
    var { auth = true } = meta;
    var isLogin = Boolean(store.state.user);

    if (auth && !isLogin && path !== '/') {
        return next({ path: '/' });
    }
    next();
})

// Make sure to inject the router.
/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
});
