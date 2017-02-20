<template>
    <div class="col-md-8">
        <div class="fixed-header">
            <div class="fixed-header-title"> 
                <div class="fixed-header-heading"> 
                    <h3>General</h3> 
                </div> 
                <div class="fixed-header-buttons"> 
                    <button class="ui tiny button" data-bind="click: publicKey">Download CMS Public Key…</button> 
                    <button class="ui tiny primary button" data-bind="click: save">Save</button> 
                </div> 
            </div> 
            <div class="ui secondary pointing menu"> 
                <a href="#/settings/general" class="item active" data-bind="css:{active:$data.active === 'info'}"> 
                    <i class="setting icon"></i> General 
                </a> 
                <a href="#/settings/email" class="item" data-bind="css:{active:$data.active === 'email'}"> 
                    <i class="mail outline icon"></i> Email 
                </a> 
                <a href="#/settings/eligibility" class="item" data-bind="visible: isPublicObs, css:{active:$data.active === 'eligibility'}"> 
                    <i class="users icon"></i> Eligibility Criteria 
                </a> 
                <a href="#/settings/data_groups" class="item" data-bind="css:{active:$data.active === 'data_groups'}"> 
                    <i class="tag icon"></i> Data Groups 
                </a> 
                <a href="#/settings/password_policy" class="item" data-bind="visible: isPublicObs, css:{active:$data.active === 'password_policy'}"> 
                    <i class="lock icon"></i> Password Policy 
                </a> 
                <a href="#/settings/user_attributes" class="item" data-bind="css:{active:$data.active === 'user_attributes'}"> 
                    <i class="add user icon"></i> User Profile 
                </a> 
                <a href="#/settings/synapse" class="item" data-bind="css:{active:$data.active === 'synapse'}"> 
                    <i class="cubes icon"></i> Synapse 
                </a> 
            </div> 
        </div>

        <h2>Log In</h2>
        <p>Log in to your account to get started.</p>
        <div class="alert alert-danger" v-if="error">
            <p>{{ error }}</p>
        </div>
        <div class="form-group">
            <label for="env">Enviornment</label>
            <select class="form-control" id="env" v-model="credentials.env">
                <option v-for="env in envList">
                    {{ env }}
                </option>
            </select>
        </div>

        <hr>

        <div class="form-group">
            <input
                type="email"
                class="form-control"
                placeholder="Enter your email"
                v-model="credentials.email"
            >
        </div>
        <div class="form-group">
            <input
                type="password"
                class="form-control"
                placeholder="Enter your password"
                v-model="credentials.password"
            >
        </div>
        <div class="form-group">
            <input
                type="study-id"
                class="form-control"
                placeholder="Enter your study id"
                v-model="credentials.study"
            >
        </div>
        <button class="ui primary button" @click="submit()" v-bind:class="{ disabled: loading }">
            Access
            <i v-if="loading" class="fa fa-circle-o-notch fa-spin" style="font-size:12px"></i>
        </button>

    </div>
</template>

<script>
import service from '../services/service'
import config from '../config'

export default {
    data () {
        return {
            // We need to initialize the component with any
            // properties that will be used in it
            loading: false,
            showModal: false,
            credentials: {
                env: window.sessionStorage.getItem('credentials') === null ? '' : JSON.parse(window.sessionStorage.getItem('credentials')).env,
                email: window.sessionStorage.getItem('credentials') === null ? '' : JSON.parse(window.sessionStorage.getItem('credentials')).email,
                password: window.sessionStorage.getItem('credentials') === null ? '' : JSON.parse(window.sessionStorage.getItem('credentials')).password,
                study: window.sessionStorage.getItem('credentials') === null ? '' : JSON.parse(window.sessionStorage.getItem('credentials')).study
            },
            error: ''
        }
    },
    computed: {
        envList: function () {
            return Object.keys(config.host);
        }
    },
    methods: {
        submit () {
            this.loading = true;
            var credentials = {
                env: this.credentials.env,
                email: this.credentials.email,
                password: this.credentials.password,
                study: this.credentials.study
            }
            window.sessionStorage.setItem('credentials', JSON.stringify(credentials));
            // We need to pass the component's this context
            // to properly make use of http in the auth service
            service.logIn(this, credentials, '/study-list').then(() => {
                this.loading = false;
            })
        }
    }

}
</script>

<style>
</style>