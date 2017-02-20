import {router} from '../main';
import config from '../config';
import store from '../store';
import Vue from 'vue';

// URL and endpoint constants
const API_URL = 'http://localhost:9000';
const LOGIN_URL = API_URL + config.signIn;
// const SIGNUP_URL = API_URL + 'users/'
const SESSION_KEY = 'session';

let session = null;

export default {

    // User object will let us check authentication status
    user: {
        authenticated: false
    },

    // Send a request to the login URL and save the returned JWT
    logIn (context, creds, redirect) {
        this.API_URL = config.host[creds.env];
        return context.$http.post(LOGIN_URL, creds, (data) => {
            data.studyName = creds.study;
            data.studyId = data.study;
            window.localStorage.setItem(SESSION_KEY, JSON.stringify(data));
            session = data;

            // create common headers
            Vue.http.headers.common['Content-Type'] = 'application/json';
            Vue.http.headers.common['Bridge-Session'] = session.sessionToken;

            this.user.authenticated = true;

            store.commit('refresh');

            // Redirect to a specified route
            if (redirect) {
                router.replace(redirect);
            }
        }).error((err) => {
            context.error = err;
        });
    },

    // To log out, we just need to remove the token
    logOut (redirect) {
        window.localStorage.removeItem(SESSION_KEY);
        store.commit('refresh');
        router.replace(redirect);
    },

    checkAuth () {
        var jwt = JSON.parse(window.localStorage.getItem(SESSION_KEY));
        if (jwt) {
            return true;
        } else {
            return false;
        }
    },

    createStudyAndUsers (context, adminIds, study, users, redirect) {
        var body = {
            'adminIds': adminIds,
            'study': study,
            'users': users
        };
        return context.$http.post(API_URL + config.createStudyAndUsers, body).then(response => {
            if (redirect) {
                router.replace(redirect);
            }
        }).error((err) => {
            context.error = err;
        });
    },

    getStudyList (context) {
        return context.$http.get(API_URL + config.getStudyList).then(response => {
            var data = response.data;
            // context.studyList = data.items;
            store.commit('refreshStudyList', data.items);
        }).error((err) => {
            context.error = err;
        });
    },

    getStudy (context, id) {
        return context.$http.get(API_URL + config.getStudy + id).then(response => {
            var data = response.data;
            // context.currentStudy = data;
            store.commit('changeCurrentStudy', data);
        }).error((err) => {
            context.error = err;
        });
    },

    updateStudy (context, study) {
        return context.$http.post(API_URL + config.updateStudy + study.identifier, study).then(response => {
            console.log('updated');
        }).error((err) => {
            context.error = err;
        });
    },

    deleteStudy (context, studyId, physical) {
        return context.$http.delete(API_URL + config.updateStudy + studyId, physical).then(response => {
            console.log('delete');
        }).error((err) => {
            context.error = err;
        });
    }
}
