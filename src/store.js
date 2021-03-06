import Vuex from 'vuex';
import Vue from 'vue';
import service from './services/service';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
    plugins: [createPersistedState({ 
        storage: window.sessionStorage 
    })],
    state: {
        user: undefined,
        API_BASE: '',
        currentStudy: undefined,
        studyList: [],
        surveyList: [],
        schemaList: []
    },
    mutations: {
        logOut (state) {
            // clean all states
            state.user = state.currentStudy = state.API_BASE = '';
            state.studyList = state.surveyList = state.schemaList = [];
        },
        refresh (state, user) {
            state.user = user;
        },
        changeCurrentStudy (state, study) {
            state.currentStudy = study;
        },
        activateStudy (state) {
            state.currentStudy.active = true;
        },
        refreshStudyList (state, studyList) {
            state.studyList = studyList;
        },
        updateBase (state, newBase) {
            state.API_BASE = newBase;
        },
        refreshSurveyList (state, surveyList) {
            state.surveyList = surveyList;
        },
        refreshSchemaList (state, schemaList) {
            state.schemaList = schemaList;
        }
    },
    actions: {
        activateStudy (store, {context, selectedStudyId}) {
            return service.getStudy(context, selectedStudyId).then((study) => {
                store.commit('changeCurrentStudy', study);
                store.commit('activateStudy');
                return service.updateStudy(context, store.state.currentStudy);
            });
        }
    }
});

