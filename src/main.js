import Vue from 'vue'
import App from './App.vue'
import Home from './components/Home.vue'
import LogIn from './components/LogIn.vue'
import CreateStudy from './components/CreateStudy.vue'
import CreateOne from './components/CreateOne.vue'
import DeleteStudy from './components/DeleteStudy.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import store from './store'
import Vee from 'vee-validate'

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vee)

export var router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: LogIn },
    { path: '/create-study', component: CreateStudy,
      children: [
        { path: 'create-one', component: CreateOne }
      ]},
    { path: '/delete-study', component: DeleteStudy },
    { path: '*', redirect: '/' }
  ]
})

router.beforeEach(({meta, path}, from, next) => {
  var { auth = true } = meta
  var isLogin = Boolean(store.state.user)

  if (auth && !isLogin && path !== '/login') {
    return next({ path: '/login' })
  }
  next()
})

// Make sure to inject the router.
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
