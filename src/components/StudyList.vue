<template>
    <div>
        <vue-toastr ref="toastr"></vue-toastr>
        <div class="fixed-header">
            <div class="fixed-header-title">
                <div class="fixed-header-heading">
                    <h3>Studies</h3>
                </div>
                <div class="fixed-header-buttons">
                    <router-link to="/create-study"><button
                        v-if="$route.path !== '/create-study'"
                        class="ui primary tiny button">
                        New Study
                    </button></router-link>
                </div>
            </div>
            <div class="ui empty secondary pointing menu">
            </div>
        </div>
        <div class="scrollbox" v-if="$route.path !== '/study-list/create-one'">
            <div class="ui negative message" v-if="error">
                <p>{{ error.message }}</p>
            </div>
            <p v-if="studyList.length === 0"><strong>There are currently no studies.</strong></p>
            <table class="ui compact selectable table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Identifier</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="study in studyList" :key="study.identifier" 
                        :class="study.active === true? '' : 'warning'">
                        <td>
                            <a v-on:click="changeCurrentStudy(study)" style="cursor: pointer;">{{ study.name }}</a>
                        </td>
                        <td>
                            {{ study.identifier }}
                        </td>
                        <td>
                            {{ study.active === true? 'Active' : 'Inactive' }}
                        </td>
                        <td style="padding: 0; text-align:right">
                            <div v-show="isDeleteable(study.identifier)">
                                <button class="ui red basic compact mini button" v-if="study.active === true" 
                                    @click="showDeleteModal(false, study.identifier)">Deactivate</button>
                                <button class="ui basic compact mini button" v-else 
                                    @click="showActivateModal(study.identifier)">Reactivate</button>
                                <button class="ui red compact mini button" 
                                    @click="showDeleteModal(true, study.identifier)">Delete</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Delete/Deactivate Study Modal Component -->
        <modal v-if="showDelete">
            <h3 slot="header">Delete Study</h3>
            <div slot="body">
                <h4>Are you sure you want to delete this study?</h4>
            </div>
            <div slot="footer">
                <button class="ui button" @click="showDelete = false">
                    Cancel
                </button>
                <button class="ui red button" @click="deleteStudy(true)" :class="{ loading: loading, disabled: loading }">
                    Delete
                </button>
            </div>
        </modal>
        <modal v-if="showDeactivate">
            <h3 slot="header">Deactivate Study</h3>
            <div slot="body">
                <h4>Are you sure you want to deactivate this study?</h4>
            </div>
            <div slot="footer">
                <button class="ui button" @click="showDeactivate = false">
                    Cancel
                </button>
                <button class="ui red button" @click="deleteStudy(false)" :class="{ loading: loading, disabled: loading }">
                    Deactivate
                </button>
            </div>
        </modal>
        <modal v-if="showActivate">
            <h3 slot="header">Reactivate Study</h3>
            <div slot="body">
                <h4>Are you sure you want to reactivate this study?</h4>
            </div>
            <div slot="footer">
                <button class="ui button" @click="showActivate = false">
                    Cancel
                </button>
                <button class="ui primary button" @click="activateStudy()" :class="{ loading: loading, disabled: loading }">
                    Reactivate
                </button>
            </div>
        </modal>
    </div>
</template>

<script>
    import store from '../store';
    import service from '../services/service';
    import {router} from '../main';
    import { mapState } from 'vuex';
    export default {
        data () {
            return {
                showDeactivate: false,
                showDelete: false,
                showActivate: false,
                loading: false,
                selectedStudyId: '',
                error: ''
            }
        },
        computed: mapState(['studyList']),
        methods: {
            isDeleteable(studyId) {
                return studyId !== 'shared' && studyId !== 'api';
            },
            showDeleteModal(physical, studyId) {
                this.selectedStudyId = studyId;
                if (physical) {
                    this.showDelete = true;
                } else {
                    this.showDeactivate = true;
                }
            },
            showActivateModal(studyId) {
                this.selectedStudyId = studyId;
                this.showActivate = true;
            },
            changeCurrentStudy(study) {
                store.commit('changeCurrentStudy', study);
                router.replace('/settings');
                return false;
            },
            deleteStudy(physical) {
                // prevent user delete study api
                if (this.selectedStudyId === 'api') {
                    this.$refs.toastr.Add({
                        title: 'Prevent Deletion',
                        msg: JSON.stringify('Cannot delete/deactivate study api.'),
                        clickClose: true,
                        timeout: 0,
                        position: 'toast-top-center',
                        type: 'error'
                    });
                    return;
                }

                this.loading = true;

                service.deleteStudy(this, this.selectedStudyId, physical).then(() => {
                    // TODO: error handling is minimal in the app, work on this
                    if (this.error) {
                        this.$refs.toastr.Add({
                            title: 'Server Error', // Toast Title
                            msg: JSON.stringify(this.error.message), // Message
                            clickClose: true, // Click Close Disable
                            timeout: 0, // Remember defaultTimeout is 5 sec..
                            position: 'toast-top-center', // Toast Position.
                            type: 'error' // Toast type
                        });
                    } else {
                        this.$refs.toastr.s(physical ? 'Study ' + this.selectedStudyId + ' Deleted!' : 'Study ' + this.selectedStudyId + ' Deactivated!');

                        service.getStudyList(this).then(this.allIndicatorsOff);
                    }
                });
            },
            activateStudy() {
                this.loading = true;
                store.dispatch('activateStudy', {
                    context: this,
                    selectedStudyId: this.selectedStudyId
                })
                .then(() => {
                    return service.getStudyList(this);
                }).then(this.allIndicatorsOff);
            },
            allIndicatorsOff() {
                this.loading = false;
                this.showDelete = false;
                this.showDeactivate = false;
                this.showActivate = false;
            }
        },
        created () {
            service.getStudyList(this);
        }
    }
</script>

<style>
</style>