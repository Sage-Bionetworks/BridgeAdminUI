<template>
    <div class="ui middle aligned center aligned grid login">
        <div class="column">
            <h2 class="ui image header">
                <div class="content">
                    Log in to your account
                </div>
            </h2>
            <form class="ui large form">
                <div class="ui negative message" v-if="error">
                    <h3>There is an issue with your request</h3>
                    <p>{{ error.message }}</p>
                </div>
                <div class="ui stacked secondary segment">
                    <div class="field">
                        <div class="ui left icon input">
                        <i class="user icon"></i>
                        <input type="text" name="email" placeholder="E-mail address" v-model="credentials.email">
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui left icon input">
                        <i class="lock icon"></i>
                        <input type="password" name="password" placeholder="Password" v-model="credentials.password">
                        </div>
                    </div>
                    <div class="field">
                        <label for="env">Enviornment</label>
                        <basic-select id="env" :options="envList" :selected-option="selectedEnv" @select="onSelectEnv" :class="{ disabled: loading }"></basic-select>
                    </div>

                    <div class="field" >
                        <label for="studyList">Study</label>
                        <basic-select id="studyList" :options="studySummaryList" :selected-option="selectedStudy" @select="onSelectStudy" :class="{ disabled: loading || studyListLoading }"></basic-select>
                    </div>
                    <div class="ui fluid large primary submit button" @click="submit()" v-bind:class="{ loading: loading, disabled: loading }">     
                        Sign In
                    </div>
                </div>
            </form>
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
            studyListLoading: false,
            showModal: false,
            credentials: {
                env: window.sessionStorage.getItem('credentials') === null ? '' : JSON.parse(window.sessionStorage.getItem('credentials')).env,
                email: window.sessionStorage.getItem('credentials') === null ? '' : JSON.parse(window.sessionStorage.getItem('credentials')).email,
                password: window.sessionStorage.getItem('credentials') === null ? '' : JSON.parse(window.sessionStorage.getItem('credentials')).password,
                study: window.sessionStorage.getItem('credentials') === null ? '' : JSON.parse(window.sessionStorage.getItem('credentials')).study,
                studyName: window.sessionStorage.getItem('credentials') === null ? '' : JSON.parse(window.sessionStorage.getItem('credentials')).studyName
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
            this.credentials.studyName = item.text;
        },
        updateStudySummaryList (env) {
            this.studyListLoading = true;
            return service.getStudySummaryList(this, env === undefined ? this.credentials.env : env).then((lst) => {
                this.studyListLoading = false;
                this.studySummaryList = lst.map((x) => {
                    if (x.identifier === 'api') {
                        this.onSelectStudy({ value: 'api', text: 'Test Study' });
                    }
                    return {
                        value: x.identifier,
                        text: x.name
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
                study: this.credentials.study,
                studyName: this.credentials.studyName
            }
            window.sessionStorage.setItem('credentials', JSON.stringify(credentials));

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
        if (this.selectedEnv.value !== '') {
            this.updateStudySummaryList(undefined);
        }
    }

}
</script>
