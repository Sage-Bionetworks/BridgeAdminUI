<template>
    <div>
        <vue-toastr ref="toastr"></vue-toastr>
        <div class="ui negative message" v-if="error">
            <p>{{ error.message }}</p>
        </div>
        <div class="fixed-header">
            <div class="fixed-header-title">
                <div class="fixed-header-heading">
                    <h3>Survey List</h3>
                </div>
                <div class="fixed-header-buttons">
                    <button class="ui red tiny button" id="show-modal" @click="showDelete = true" :disabled="selectedSurveyGuidsWithCreatedOns.length === 0">
                        Delete
                    </button>
                </div>
            </div>
            <div class="ui empty secondary pointing menu">
            </div>
        </div>

        <div class="scrollbox">

            <p v-if="surveyList.length === 0"><strong>There are currently no survey</strong></p>

            <table class="ui compact selectable table">
                <thead>
                    <tr>
                        <th width="10">
                            <div class="ui fitted checkbox" id="roles">
                                <input type="checkbox" v-model="selectAll">
                                <label></label>
                            </div>
                        </th>
                        <th>Name</th>
                        <th>Last Updated</th>
                        <th>Schedule(s)</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="survey in surveyList">
                        <td>
                            <div class="ui fitted checkbox" id="roles">
                                <input type="checkbox" v-model="selectedSurveyGuidsWithCreatedOns" :value="{ guid: survey.guid, createdOn: survey.createdOn }">
                                <label></label>
                            </div>
                        </td>
                        <td>
                            {{ survey.name }}
                        </td>
                        <td>
                            {{ new Date(survey.createdOn) | moment }}
                        </td>
                        <td>
                            {{ survey.elements.length === 0? '' : survey.elements }}
                        </td>
                        <td>
                            {{ survey.deleted === true? 'Deactive' : 'Active' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Delete/Deactivate Survey Modal Component -->
        <modal v-if="showDelete">
            <h3 slot="header">Delete Study</h3>
            <div slot="body">
                <h4 v-if="this.selectedSurveyGuidsWithCreatedOns.length === 1">Are you sure you want to delete this survey?</h4>
                <h4 v-if="this.selectedSurveyGuidsWithCreatedOns.length !== 1">Are you sure you want to delete these surveys?</h4>
            </div>
            <div slot="footer">
                <button class="ui button" @click="showDelete = false">
                    Cancel
                </button>
                <button class="ui red button" @click="deleteSurvey(true)" :class="{ loading: loading, disabled: loading }">
                    Delete
                </button>
            </div>
        </modal>
    </div>
</template>

<script>
    import service from '../services/service'
    import { mapState } from 'vuex'
    import moment from 'moment'

    export default {
        filters: {
            moment: function (date) {
                return moment(date).format('M/D/YY, h:mm:ss A');
            }
        },
        data () {
            return {
                showDeactivate: false,
                showDelete: false,
                loading: false,
                selectedSurveyGuidsWithCreatedOns: [],
                error: ''
            }
        },
        computed: {
            selectAll: {
                get: function () {
                    return this.surveyList ? this.selectedSurveyGuidsWithCreatedOns.length === this.surveyList.length : false;
                },
                set: function (value) {
                    var selected = [];
                    if (value) {
                        this.surveyList.forEach(function (survey) {
                            selected.push({ guid: survey.guid, createdOn: survey.createdOn });
                        });
                    }
                    this.selectedSurveyGuidsWithCreatedOns = selected;
                }
            },
            ...mapState({surveyList: state => state.surveyList})
        },
        methods: {
            deleteSurvey (physical) {
                this.loading = true;
                var cxt = this;
                var errorStack = [];
                // async promise
                var promise = new Promise(function (resolve, reject) {
                    var completeRequest = 0;
                    for (var i in cxt.selectedSurveyGuidsWithCreatedOns) {
                        var surveyKeys = cxt.selectedSurveyGuidsWithCreatedOns[i];
                        service.deleteSurvey(cxt, surveyKeys, physical).then(() => {
                            if (cxt.error) {
                                errorStack.push(cxt.error.message);
                            } else {
                                cxt.$refs.toastr.s(physical ? 'Survey ' + surveyKeys + ' Deleted!' : 'Survey ' + surveyKeys + ' Deactivated!');
                            }
                            completeRequest++;
                            if (completeRequest === cxt.selectedSurveyGuidsWithCreatedOns.length) {
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
                    // remove all element already deleted in selectedSurveyGuidsWithCreatedOns
                    cxt.selectedSurveyGuidsWithCreatedOns = [];
                    service.getSurveyList(cxt).then(() => {
                        cxt.loading = false;
                        cxt.showDelete = false;
                        cxt.showDeactivate = false;
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
            }
        },
        created () {
            service.getSurveyList(this);
            service.getSchemaList(this);
        }
    }
</script>

<style>
</style>