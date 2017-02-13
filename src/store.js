import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: undefined
  },
  mutations: {
    refresh (state) {
      state.user = JSON.parse(window.localStorage.getItem('session'))
    }
  }
})

