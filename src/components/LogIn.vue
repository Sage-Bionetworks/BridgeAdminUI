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

        <div class="ui form scrollbox">
            <p>Log in to your account to get started.</p>
            <div class="ui negative message" v-if="error">
                <h3>There is an issue with your request</h3>
                <p>{{ error.message }}</p>

            </div>
            <div class="three wide field">
                <label for="env">Enviornment</label>
                <basic-select id="env" :options="envList" :selected-option="selectedEnv" @select="onSelectEnv" :class="{ disabled: loading }"></basic-select>
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
            <div class="three wide field" :class="{ disabled: loading }">
                <basic-select id="studyList" :options="studySummaryList" :selected-option="selectedStudy" @select="onSelectStudy"></basic-select>
            </div>
            <button class="ui primary button" @click="submit()" v-bind:class="{ loading: loading, disabled: loading }">
                Access
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
            studySummaryList: [],
            selectedStudy: {},
            error: ''
        }
    },
    computed: {
        envList: function () {
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

            // change study summary list accordingly
            this.updateStudySummaryList();
        },
        onSelectStudy (item) {
            this.selectedStudy = item;
            this.credentials.study = item.value;
        },
        updateStudySummaryList (env) {
            return service.getStudySummaryList(this, env === undefined ? this.credentials.env : env).then((lst) => {
                this.studySummaryList = lst.map((x) => {
                    if (x.identifier === 'api') {
                        this.onSelectStudy({ value: 'api', text: 'api' });
                    }
                    return {
                        value: x.identifier,
                        text: x.identifier
                    }
                });
            })
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
        };
        // default env
        this.updateStudySummaryList(Object.keys(this.selectedEnv).length === 0 ? 'local' : undefined);
    }

}
</script>
