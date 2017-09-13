<template>
    <div id="app" style="height: 100%; outline: 2px solid blue">
        <header :class="currentHeaderEnv"> 
            <div class="header-env">
                <i class="white heartbeat icon"></i>
                <span>Bridge Admin<span v-if="user"> for {{ user? user.environment : '' }}</span></span>
            </div>
        </header>
        <section>
            <nav v-if="user">
                <div class="ui vertical menu">
                    <div class="item">
                        <i class="settings icon"></i> Cross-Study Admin
                        <div class="menu">
                            <a><router-link to="/study-list" class="item" :class="{ active: pathTo === '/study-list' || pathTo === '/create-study' || pathTo === '/settings' }">Studies</router-link></a>
                            <a><router-link to="/cache" class="item" :class="{ active: pathTo === '/cache' }">Cache Control</router-link></a>
                        </div>
                    </div>

                    <div class="item">
                        <i class="server icon"></i> Study Data
                        <div class="menu">
                            <a><router-link to="/schema-list" class="item" :class="{ active: pathTo === '/schema-list' }">Data Schemas</router-link></a>
                            <a><router-link to="/survey-list" class="item" :class="{ active: pathTo === '/survey-list' }">Surveys</router-link></a>
                        </div>
                    </div>

                    <div class="item">
                        <i class="sign out icon"></i> <a href="" @click="logOut()">Sign Out</a>
                    </div>
                </div>
            </nav>
            <main>
                <router-view></router-view>
            </main>
        </section>
        <footer>
            <p>&copy; 2017 Sage Bionetworks. </p>
        </footer>
    </div>
</template>

<script>
import service from './services/service';
import { mapState } from 'vuex';
import store from './store';

export default {
    data () {
        return {
            pathTo: '',
            pathFrom: ''
        }
    },
    computed: {
        currentHeaderEnv: function () {
            if (store.state.user) {
                if (store.state.user.environment !== 'production') {
                    return 'dev';
                } else {
                    return;
                }
            } else {
                return;
            }
        },
        ...mapState({ user: state => state.user })
    },
    methods: {
        logOut () {
            service.logOut('/');
        }
    },
    mounted () {
    },
    watch: {
        '$route' (to, from) {
            this.pathTo = to.path;
            this.pathFrom = from.path;
        }
    }
}
</script>

<style lang="sass">
@import "./assets/css/main.scss";
</style>