import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: undefined,
        currentStudy: undefined,
        studyList: []
    },
    mutations: {
        refresh (state) {
            state.user = JSON.parse(window.localStorage.getItem('session'));
        },
        changeCurrentStudy (state, study) {
            state.currentStudy = study;
        },
        refreshStudyList (state, studyList) {
            state.studyList = studyList;
        }
    }
})

