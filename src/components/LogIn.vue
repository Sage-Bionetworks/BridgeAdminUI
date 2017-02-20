<template>
    <div>
        <div class="fixed-header">
            <div class="fixed-header-title"> 
                <div class="fixed-header-heading"> 
                    <h3>Log In</h3> 
                </div> 
            </div> 
            <div class="ui empty secondary pointing menu"> 
            </div> 
        </div>

        <div class="ui form">
            <p>Log in to your account to get started.</p>
            <div class="ui negative message" v-if="error">
                <p>{{ error }}</p>
            </div>
            <div class="three wide field">
                <label for="env">Enviornment</label>
                <basic-select id="env" :options="envList" :selected-option="selectedEnv" @select="onSelectEnv"></basic-select>
            </div>

            <hr>

            <div class="three wide field">
                <input
                    type="email"
                    placeholder="Enter your email"
                    v-model="credentials.email"
                >
            </div>
            <div class="three wide field">
                <input
                    type="password"
                    placeholder="Enter your password"
                    v-model="credentials.password"
                >
            </div>
            <div class="three wide field">
                <input
                    type="text"
                    placeholder="Enter your study id"
                    v-model="credentials.study"
                >
            </div>
            <button class="ui primary button" @click="submit()" v-bind:class="{ disabled: loading }">
                Access
                <i v-if="loading" class="fa fa-circle-o-notch fa-spin" style="font-size:12px"></i>
            </button>
        </div>

    </div>
</template>

<script>
import service from '../services/service'
import config from '../config'
import { BasicSelect } from 'vue-search-select'

export default {
    components: {
        BasicSelect
    },
    data () {
        return {
            loading: false,
            showModal: false,
            credentials: {
                env: window.sessionStorage.getItem('credentials') === null ? '' : JSON.parse(window.sessionStorage.getItem('credentials')).env,
                email: window.sessionStorage.getItem('credentials') === null ? '' : JSON.parse(window.sessionStorage.getItem('credentials')).email,
                password: window.sessionStorage.getItem('credentials') === null ? '' : JSON.parse(window.sessionStorage.getItem('credentials')).password,
                study: window.sessionStorage.getItem('credentials') === null ? '' : JSON.parse(window.sessionStorage.getItem('credentials')).study
            },
            selectedEnv: {},
            error: ''
        }
    },
    computed: {
        envList: function () {
            // return Object.keys(config.host);
            return Object.keys(config.host).map((x) => {
                return {
                    value: x,
                    text: x
                }
            });
        }
    },
    methods: {
        onSelectEnv (item) {
            this.selectedEnv = item
            this.credentials.env = item.value;
            console.log(this.credentials.env)
        },
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
    },
    mounted () {
        this.selectedEnv = {
            value: this.credentials.env,
            text: this.credentials.env
        }
    }

}
</script>
