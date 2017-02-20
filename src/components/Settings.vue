<template>
    <div>
        <vue-toastr ref="toastr"></vue-toastr>
        <div class="fixed-header">
            <div class="fixed-header-title">
                <div class="fixed-header-heading">
                    <h3>Admin Settings for Study: {{ currentStudy.name }}</h3> 
                </div>
                <div class="fixed-header-buttons">
                    <button class="ui tiny primary button" @click="updateStudy()" :disabled="loading">
                        Save
                        <i v-if="loading" class="fa fa-circle-o-notch fa-spin" style="font-size:12px"></i>
                    </button>
                </div>
            </div>
            <div class="ui empty secondary pointing menu">
            </div>
        </div>

        <div class="scrollbox">
            <div class="alert alert-danger" v-if="error">
                <p>{{ error }}</p>
            </div>
            <form class="ui form">
                <div class="field">
                    <label>Health code export</label>
                    <input type="checkbox" class="ui checkbox" v-bind:checked="currentStudy === undefined? false : currentStudy.healthCodeExportEnabled" v-model="currentStudy === undefined? '' : currentStudy.healthCodeExportEnabled"> Include participant health code on the participant information page
                </div>
                <div class="field">
                    <label>Email verification</label>
                    <input type="checkbox" class="ui checkbox" v-bind:checked="currentStudy === undefined? false : currentStudy.emailVerificationEnabled" v-model="currentStudy === undefined? '' : currentStudy.emailVerificationEnabled"> Require participants to verify their email address
                </div>
                <div class="field">
                    <label>External ID validation</label>
                    <input type="checkbox" class="ui checkbox" v-bind:checked="currentStudy === undefined? false : currentStudy.externalIdValidationEnabled" v-model="currentStudy === undefined? '' : currentStudy.externalIdValidationEnabled"> Enable Bridge management of external IDs
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
        computed: mapState({ currentStudy: state => state.currentStudy }),
        methods: {
            updateStudy () {
                this.loading = true;
                service.updateStudy(this, this.currentStudy).then(() => {
                    this.$refs.toastr.s('Study Updated.');

                    // need to get the study again
                    service.getStudy(this, this.currentStudy.identifier).then(() => {
                        this.loading = false;
                    })
                })
            }
        }
    }
</script>