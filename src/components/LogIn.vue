<template>
    <div style="width: 30rem; margin: 4rem auto">
        <h2 style="text-align:center">Sign In</h2>
        <form class="ui large form">
            <div class="ui negative message" v-if="error">
                <h3>There is an issue with your request</h3>
                <p>{{ error.message }}</p>
            </div>
            <div class="ui secondary segment">
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
                <div class="two fields">
                    <div class="field">
                        <label for="env">Environment</label>
                        <basic-select id="env" :options="envList" :selected-option="selectedEnv" 
                            @select="onSelectEnv" :class="{ disabled: loading }"></basic-select>
                    </div>
                    <div class="field" >
                        <label for="studyList">Study</label>
                        <basic-select id="studyList" :options="studySummaryList" :selected-option="selectedStudy" 
                            @select="onSelectStudy" :class="{ disabled: loading || studyListLoading }"></basic-select>
                    </div>
                </div>
                <div class="ui fluid large primary submit button" @click="submit()" v-bind:class="{ loading: loading, disabled: loading }">     
                    Sign In
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import service from '../services/service';
import config from '../config';
import { BasicSelect } from 'vue-search-select';

function credentials(fieldName) {
    var creds = window.sessionStorage.getItem('credentials');
    return creds === null ? '' : JSON.parse(creds)[fieldName];
}

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
                env: credentials('env'),
                email: credentials('email'),
                password: credentials('password'),
                study: credentials('study'),
                studyName: credentials('studyName')
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
                return {value: x, text: x.substring(0,1).toUpperCase() + x.substring(1)}
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
