<template>
    <div>
        <vue-toastr ref="toastr"></vue-toastr>
        <div class="fixed-header">
            <div class="fixed-header-title">
                <div class="fixed-header-heading">
                    <h3>Admin Settings for Study: {{ currentStudy.name }}</h3> 
                </div>
                <div class="fixed-header-buttons">
                    <button class="ui tiny primary button" @click="updateStudy()" :disabled="loading" :class="{ loading: loading }">
                        Save
                    </button>
                </div>
            </div>
            <div class="ui empty secondary pointing menu">
            </div>
        </div>

        <div class="scrollbox">
            <div class="ui negative message" v-if="error">
                <p>{{ error }}</p>
            </div>
            <form class="ui form">
                <div class="field">
                    <label>Health code export</label>
                    <div class="ui checkbox">
                        <input type="checkbox" v-bind:checked="currentStudy === undefined? false : currentStudy.healthCodeExportEnabled" v-model="currentStudy === undefined? '' : currentStudy.healthCodeExportEnabled">
                        <label>Include participant health code on the participant information page</label>
                    </div>
                </div>
                <div class="field">
                    <label>Email verification</label>
                    <div class="ui checkbox">
                        <input type="checkbox" class="ui checkbox" v-bind:checked="currentStudy === undefined? false : currentStudy.emailVerificationEnabled" v-model="currentStudy === undefined? '' : currentStudy.emailVerificationEnabled">
                        <label>Require participants to verify their email address</label>
                    </div>
                </div>
                <div class="field">
                    <label>External ID validation</label>
                    <div class="ui checkbox">
                        <input type="checkbox" class="ui checkbox" v-bind:checked="currentStudy === undefined? false : currentStudy.externalIdValidationEnabled" v-model="currentStudy === undefined? '' : currentStudy.externalIdValidationEnabled">
                        <label>Enable Bridge management of external IDs</label>
                    </div>
                </div>
                <div class="field">
                    <label>Require external ID on sign up</label>
                    <div class="ui checkbox">
                        <input type="checkbox" class="ui checkbox" v-bind:checked="currentStudy === undefined? false : currentStudy.externalIdRequiredOnSignup" v-model="currentStudy === undefined? '' : currentStudy.externalIdRequiredOnSignup">
                        <label>External ID is required when user submits initial sign up</label>
                    </div>
                </div>

                <h4>Notifications</h4>
                <div class="field">
                    <label>iOS Platform ARN</label>
                    <input style="width:40rem" type="text" v-model="pushNotificationARNs['iPhone OS']"/>
                </div>
                <div class="field">
                    <label>Android Platform ARN</label>
                    <input style="width:40rem" type="text" v-model="pushNotificationARNs['Android']"/>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import service from '../services/service'

    export default {
        props: ['deleted'],
        data () {
            return {
                loading: false
            }
        },
        computed: mapState({
            currentStudy: state => state.currentStudy,
            pushNotificationARNs: state => state.currentStudy.pushNotificationARNs
        }),
        methods: {
            updateStudy () {
                this.loading = true;
                service.updateStudy(this, this.currentStudy).then(() => {
                    // need to get the study again
                    service.getStudy(this, this.currentStudy.identifier).then(() => {
                        this.loading = false;
                    })
                })
            }
        }
    }
</script>