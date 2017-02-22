import {router} from '../main';
import config from '../config';
import store from '../store';
import Vue from 'vue';

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
        return context.$http.post(this.API_URL + config.signIn, creds, (data) => {
            // context.error = '';
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
        // router.replace(redirect);
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
        return context.$http.post(this.API_URL + config.createStudyAndUsers, body).then(response => {
            if (redirect) {
                router.replace(redirect);
            }
        }).error((err) => {
            context.error = err;
        });
    },

    getStudyList (context) {
        return context.$http.get(this.API_URL + config.getStudyList).then(response => {
            var data = response.data;
            store.commit('refreshStudyList', data.items);
        }).error((err) => {
            context.error = err;
        });
    },

    getStudySummaryList (context, env) {
        return context.$http.get(config.host[env] + config.getStudySummaryList).then(response => {
            var data = response.data;
            return data.items
        }).error((err) => {
            context.error = err;
            return;
        });
    },

    getStudy (context, id) {
        return context.$http.get(this.API_URL + config.getStudy + id).then(response => {
            var data = response.data;
            store.commit('changeCurrentStudy', data);
        }).error((err) => {
            context.error = err;
        });
    },

    updateStudy (context, study) {
        return context.$http.post(this.API_URL + config.updateStudy + study.identifier, study).then(response => {
            context.$refs.toastr.s('Study Updated.');
        }).error((err) => {
            context.error = err;
            context.$refs.toastr.e(JSON.stringify(err));
        });
    },

    deleteStudy (context, studyId, physical) {
        return context.$http.delete(this.API_URL + config.updateStudy + studyId + '?' + 'physical=' + physical).then(response => {
        }).error((err) => {
            context.error = err;
        });
    },

    getCacheKeys (context) {
        return context.$http.get(this.API_URL + config.getCacheKeys).then(response => {
            context.cacheKeys = response.data;
        }).error((err) => {
            context.error = err;
        });
    },

    deleteKey (context, key) {
        key = key.replace(':', '%3A'); // change colon to URI code
        return context.$http.delete(this.API_URL + config.deleteCacheKey + key).then(response => {
        }).error((err) => {
            context.error = err;
        });
    }
}
