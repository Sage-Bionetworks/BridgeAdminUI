<template>
    <div id="app">
        <header class="dev"> 
            <h2><i class="white heartbeat icon"></i> Bridge Admin</h2> 
        </header>
        <section>
            <nav class="ui vertical menu">
                <div class="tabset">
                    <a class="active">Navigation</a>
                </div>
                <div class="item">
                    <i class="settings icon"></i> Study Admin
                    <div class="menu">
                        <a><router-link to="/study-list" class="item" v-if="user">Study List</router-link></a>
                        <a><router-link to="/cache" class="item" v-if="user">Cache Control</router-link></a>
                    </div>
                </div>
                <div class="item" v-if="user">
                    <i class="sign out icon"></i> <a href="" @click="logOut()">Sign Out</a>
                </div>
            </nav>
            <main class="col-md-8">
                <router-view></router-view>
            </main>
        </section>
    </div>
</template>

<script>
import service from './services/service'
import { mapState } from 'vuex'

export default {
    data () {
        return {
        }
    },
    computed: mapState({ user: state => state.user }),
    methods: {
        logOut () {
            service.logOut('/');
        }
    },
    mounted () {
    }
}
</script>

<style lang="sass">
@import "./assets/css/main.scss";
</style>