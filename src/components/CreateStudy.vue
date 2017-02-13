<template>
  <div>
    <router-link to="/create-study/create-one"><button
      v-if="$route.path !== '/create-study/create-one'"
      class="btn btn-primary">
      Create One
    </button></router-link>

    <div v-if="$route.path === '/create-study/create-one'">
      <h3>Create Study</h3>     
    </div>

    <hr>

    <router-view></router-view>

    <div class="study-list" v-if="$route.path !== '/create-study/create-one'">
      <p v-if="!studyList.length"><strong>No study yet</strong></p>
      
      <div class="list-group">

        <a class="list-group-item" v-for="study in studyList">
          <div class="row">
              <p class="text-center">
                <strong>
                  Study Name: {{ study.name }} 
                </strong>
              </p>
              <p class="text-center">
                Study ID: {{ study.identifier }} 
              </p>
          </div>        
        </a>

      </div>
  </div>
</template>

<script>
  import store from '../store'
  import service from '../services/service'

  export default {
    data () {
      // We want to start with an existing time entry
      return {
        // Start out with the existing entry
        // by placing it in the array
        studyList: []
      }
    },
    methods: {
      // Get the index of the clicked time entry and splice it out
      deleteTimeEntry (timeEntry) {
        if (window.confirm('Are you sure you want to delete this time entry?')) {
          store.commit('deleteTime', timeEntry)
        }
      }
    },
    route: {
      // Check the users auth status before
      // allowing navigation to the route
      canActivate () {
        return service.checkAuth()
      }
    },

    mounted () {
      service.getStudyList(this)
    }
  }
</script>

<style>
</style>