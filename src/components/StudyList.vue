<template>
    <div>
        <vue-toastr ref="toastr"></vue-toastr>
        <div class="alert alert-danger" v-if="error">
            <p>{{ error }}</p>
        </div>
        <div class="fixed-header">
            <div class="fixed-header-title">
                <div class="fixed-header-heading">
                    <h3>Study List</h3>
                </div>
                <div class="fixed-header-buttons">
                    <button class="ui red tiny button" v-if="$route.path !== '/study-list/create-one'" id="show-modal" @click="showDelete = true" :disabled="selectedStudyIds.length === 0">
                        Delete
                    </button>
                    <button class="ui red tiny button" v-if="$route.path !== '/study-list/create-one'" id="show-modal" @click="showDeactivate = true" :disabled="selectedStudyIds.length === 0">Deactivate</button>
                    <router-link to="/study-list/create-one"><button
                        v-if="$route.path !== '/study-list/create-one'"
                        class="ui primary tiny button">
                        Create One
                    </button></router-link>
                </div>
            </div>
            <div class="ui empty secondary pointing menu">
            </div>
        </div>

        <div v-if="$route.path === '/study-list/create-one'">
            <h3>Create Study</h3>     
        </div>

        <router-view></router-view>

        <div class="scrollbox" v-if="$route.path !== '/study-list/create-one'">

            <p v-if="studyList.length === 0"><strong>Loading Studies...</strong></p>

            <table class="ui compact selectable table">
                <thead>
                    <tr>
                        <th width="10">
                            <input type="checkbox" class="ui checkbox" v-model="selectAll">
                        </th>
                        <th>Name</th>
                        <th>Identifier</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tr v-for="study in studyList">
                    <td>
                        <input type="checkbox" class="ui checkbox" v-model="selectedStudyIds" :value="study.identifier">
                    </td>
                    <td>
                        <a v-on:click="changeCurrentStudy(study)">{{ study.name }}</a>
                    </td>
                    <td>
                        {{ study.identifier }}
                    </td>
                    <td>
                        {{ study.active === true? 'Active' : 'Deactive' }}
                    </td>
                </tr>
            </table>
        </div>

        <!-- Delete/Deactivate Study Modal Component -->
        <modal v-if="showDelete">
            <div class="alert alert-danger" v-if="error">
                <p>{{ error }}</p>
            </div>
            <h3 slot="header">Delete Study</h3>
            <div slot="body">
                <h4 v-if="this.selectedStudyIds.length === 1">Ready to delete: {{ this.selectedStudyIds[0] }}?</h4>
                <h4 v-if="this.selectedStudyIds.length !== 1">Ready to delete: {{ this.selectedStudyIds[0] }} and other {{ this.selectedStudyIds.length - 1 }} studies?</h4>
            </div>
            <div slot="footer">
                <button class="ui button" @click="showDelete = false">
                    Cancel
                </button>
                <button class="ui blue button" @click="deleteStudy(true)" :disabled="loading">
                    Commit
                    <i v-if="loading" class="fa fa-circle-o-notch fa-spin" style="font-size:12px"></i>
                </button>
            </div>
        </modal>
        <modal v-if="showDeactivate">
            <div class="alert alert-danger" v-if="error">
                <p>{{ error }}</p>
            </div>
            <h3 slot="header">Deactivate Study</h3>
            <div slot="body">
                <h4>Ready to Deactivate: {{ this.selectedStudyIds[0] }} and other {{ this.selectedStudyIds.length - 1 }} studies?</h4>
            </div>
            <div slot="footer">
                <button class="ui button" @click="showDeactivate = false">
                    Cancel
                </button>
                <button class="ui blue button" @click="deleteStudy(false)" :disabled="loading">
                    Commit
                    <i v-if="loading" class="fa fa-circle-o-notch fa-spin" style="font-size:12px"></i>
                </button>
            </div>
        </modal>
    </div>
</template>

<script>
    import store from '../store'
    import service from '../services/service'
    import {router} from '../main';
    import { mapState } from 'vuex'
    export default {
        data () {
            // We want to start with an existing time entry
            return {
                // Start out with the existing entry
                // by placing it in the array
                // studyList: [],
                showDeactivate: false,
                showDelete: false,
                loading: false,
                selectedStudyIds: [],
                error: ''
            }
        },
        computed: {
            selectAll: {
                get: function () {
                    return this.studyList ? this.selectedStudyIds.length === this.studyList.length : false;
                },
                set: function (value) {
                    var selected = [];
                    if (value) {
                        this.studyList.forEach(function (study) {
                            selected.push(study.identifier);
                        });
                    }

                    this.selectedStudyIds = selected;
                }
            },
            ...mapState({studyList: state => state.studyList})
        },
        methods: {
            changeCurrentStudy (study) {
                store.commit('changeCurrentStudy', study);
                router.replace('/settings');
            },
            deleteStudy (physical) {
                console.log(this.selectedStudyIds);
                this.loading = true;
                var cxt = this;
                var errorStack = [];
                var sutyIdsDeleted = [];
                // async promise
                var promise = new Promise(function (resolve, reject) {
                    var completeRequest = 0;
                    for (var i in cxt.selectedStudyIds) {
                        var studyId = cxt.selectedStudyIds[i];
                        service.deleteStudy(cxt, studyId, physical).then(() => {
                            if (cxt.error) {
                                errorStack.push(cxt.error);
                            } else {
                                cxt.$refs.toastr.s(physical ? 'Study' + studyId + 'Deleted!' : 'Study' + studyId + 'Deactivated!');
                                // remove deleted study in selected study list
                                sutyIdsDeleted.push(studyId);
                            }
                            completeRequest++;
                            if (completeRequest === cxt.selectedStudyIds.length) {
                                if (errorStack.length === 0) {
                                    resolve('Done!');
                                } else {
                                    reject(Error(errorStack));
                                }
                            }
                        });
                    }
                });

                promise.then(function (result) {
                    // remove all element already deleted in selectedStudyIds
                    cxt.selectedStudyIds = [];
                    console.log(cxt.selectedStudyIds);
                    service.getStudyList(cxt).then(() => {
                        cxt.loading = false;
                        cxt.showDelete = false;
                    });
                }, function (err) {
                    console.log(err);
                    cxt.$refs.toastr.Add({
                        title: 'Server Error', // Toast Title
                        msg: JSON.stringify(errorStack), // Message
                        clickClose: true, // Click Close Disable
                        timeout: 0, // Remember defaultTimeout is 5 sec..
                        position: 'toast-top-center', // Toast Position.
                        type: 'error' // Toast type
                    });
                    cxt.loading = false;
                });

                console.log(physical ? 'Delete study!' : 'Deactivate study!');
            }
        },
        route: {
            // Check the users auth status before
            // allowing navigation to the route
            canActivate () {
                return service.checkAuth();
            }
        },
        created () {
            service.getStudyList(this);
        }
    }
</script>

<style>
@import "../assets/general.scss";
</style>