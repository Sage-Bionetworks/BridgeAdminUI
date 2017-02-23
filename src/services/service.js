import {router} from '../main';
import config from '../config';
import store from '../store';

export default {

    logIn (context, creds, redirect) {
        store.commit('updateBase', config.host[creds.env]);
        return context.$http.post(store.state.API_BASE + config.signIn, creds).then(response => {
            var data = response.data;

            data.studyName = creds.studyName;
            data.studyId = creds.study;
            store.commit('refresh', data);

            // Redirect to a specified route
            if (redirect) {
                router.replace(redirect);
            }
        }, err => {
            context.error = err;
        });
    },

    logOut (redirect) {
        store.commit('logOut');
        router.replace(redirect);
    },

    createStudyAndUsers (context, adminIds, study, users, redirect) {
        var body = {
            'adminIds': adminIds,
            'study': study,
            'users': users
        };
        return context.$http.post(store.state.API_BASE + config.createStudyAndUsers, body).then(response => {
            if (redirect) {
                router.replace(redirect);
            }
        }, err => {
            context.error = err;
        });
    },

    getStudyList (context) {
        return context.$http.get(store.state.API_BASE + config.getStudyList).then(response => {
            var data = response.data;
            store.commit('refreshStudyList', data.items);
        }, err => {
            context.error = err;
        });
    },

    getStudySummaryList (context, env) {
        return context.$http.get(config.host[env] + config.getStudySummaryList).then(response => {
            var data = response.data;
            return data.items
        }, err => {
            context.error = err;
            return;
        });
    },

    getStudy (context, id) {
        return context.$http.get(store.state.API_BASE + config.getStudy + id).then(response => {
            var data = response.data;
            store.commit('changeCurrentStudy', data);
        }, err => {
            context.error = err;
        });
    },

    updateStudy (context, study) {
        return context.$http.post(store.state.API_BASE + config.updateStudy + study.identifier, study).then(response => {
            context.$refs.toastr.s('Study Updated.');
        }, err => {
            context.error = err;
            context.$refs.toastr.e(JSON.stringify(err));
        });
    },

    deleteStudy (context, studyId, physical) {
        return context.$http.delete(store.state.API_BASE + config.updateStudy + studyId + '?' + 'physical=' + physical).then(response => {
        }, err => {
            context.error = err;
        });
    },

    getCacheKeys (context) {
        return context.$http.get(store.state.API_BASE + config.getCacheKeys).then(response => {
            context.cacheKeys = response.data;
        }, err => {
            context.error = err;
        });
    },

    deleteKey (context, key) {
        key = key.replace(':', '%3A'); // change colon to URI code
        return context.$http.delete(store.state.API_BASE + config.deleteCacheKey + key).then(response => {
        }, err => {
            context.error = err;
        });
    },

    getSurveyList (context) {
        return context.$http.get(store.state.API_BASE + config.getSurveyList).then(response => {
            var data = response.data;
            store.commit('refreshSurveyList', data.items);
        }, err => {
            context.error = err;
        });
    },

    deleteSurvey (context, surveyKeys, physical) {
        var guid = surveyKeys.guid;
        var createdOn = surveyKeys.createdOn;
        var deleteApi = guid + '/revisions/' + createdOn + '?' + 'physical=' + physical;
        return context.$http.delete(store.state.API_BASE + config.deleteSurvey + deleteApi).then(response => {
        }, err => {
            context.error = err;
        });
    },

    getSchemaList (context) {
        return context.$http.get(store.state.API_BASE + config.getSchemaList).then(response => {
            var data = response.data;
            store.commit('refreshSchemaList', data.items);
        }, err => {
            context.error = err;
        });
    },

    deleteSchema (context, schemaId) {
        var currentStudyId = store.state.user.studyId;
        var deleteSchemaApi = config.updateStudy + currentStudyId + '/uploadschemas/' + schemaId;
        return context.$http.delete(store.state.API_BASE + deleteSchemaApi).then(response => {
        }, err => {
            context.error = err;
        });
    }
}
