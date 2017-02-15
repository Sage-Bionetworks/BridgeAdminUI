<template>
    <div id="app">
        <nav class="navbar navbar-default">
            <div class="container">
                <a class="navbar-brand"><router-link to="/">
                    <i class="glyphicon glyphicon-time"></i>
                    Bridge Admin
                    </router-link>
                </a>
                <ul class="nav navbar-nav">
                    <li><router-link to="/">Home</router-link></li>
                    <li><router-link to="/login" v-if="!user">LogIn</router-link></li>
                    <li><router-link to="/create-study" v-if="user">Create Study</router-link></li>
                    <li><router-link to="/delete-study" v-if="user">Delete Study</router-link></li>
                    <li><button class="btn btn-primary" v-if="user" @click="logOut()">LogOut</button></li>
                </ul>
            </div>
        </nav>
        <div class="container">
            <div class="col-sm-12">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import service from './services/service'
    import { mapState } from 'vuex'

    export default {
        computed: mapState({ user: state => state.user }),
        methods: {
            logOut () {
                service.logOut('/');
            }
        }
    }
</script>
