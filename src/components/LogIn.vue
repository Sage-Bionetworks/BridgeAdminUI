<template>
    <div class="col-sm-4 col-sm-offset-3">
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
        <button class="btn btn-primary" @click="submit()" v-bind:class="{ disabled: loading }">Access</button>
        <i v-if="loading" class="fa fa-circle-o-notch fa-spin" style="font-size:24px"></i>

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
            service.logIn(this, credentials, '/create-study').then(() => {
                this.loading = false;
            })
        }
    }

}
</script>