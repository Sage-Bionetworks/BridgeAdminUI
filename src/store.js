import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        user: undefined,
        API_BASE: '',
        currentStudy: undefined,
        studyList: []
    },
    mutations: {
        refresh (state, user) {
            state.user = user;
        },
        changeCurrentStudy (state, study) {
            state.currentStudy = study;
        },
        refreshStudyList (state, studyList) {
            state.studyList = studyList;
        },
        updateBase (state, newBase) {
            state.API_BASE = newBase;
        }
    }
})

