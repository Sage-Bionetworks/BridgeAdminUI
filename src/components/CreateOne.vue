<template>
  <div>
    <div class="create-one">
      <div class="admin-info">
        <h2>Admin Information</h2>
          <div class="form-group">
            <label for="admin-list">Admin Accounts attached to this new Study</label>
            <select multiple class="form-control" id="admin-list" v-model="selectedAdmins">
              <option v-for="(value, key) in adminList" v-bind:value="value">
                {{ key }}
              </option>
            </select>
          </div>
      </div>
      <div class="study-info">
        <h2>Study Information</h2>
        <form> 
          <div class="form-group" :class="{'has-error': errors.has('study-id') }">
            <label for="study-id">Study ID</label>
            <input type="identifier" class="form-control" name="study-id" v-model="study.identifier" v-validate:identifier.initial="'required|alpha_dash'" :class="{'input': true, 'is-danger': errors.has('study-id') }">
            <p class="text-danger" v-if="errors.has('study-id')">{{ errors.first('study-id') }}</p>
          </div>
          <div class="form-group" :class="{'has-error': errors.has('study-name') }">
            <label for="study-name">Study Name</label>
            <input type="name" class="form-control" name="study-name" v-model="study.name" v-validate:name.initial="'required|alpha_dash'" :class="{'input': true, 'is-danger': errors.has('study-name') }">
            <p class="text-danger" v-if="errors.has('study-name')">{{ errors.first('study-name') }}</p>
          </div>
          <div class="form-group" :class="{'has-error': errors.has('supportEmail') }">
            <label for="supportEmail">Support Email</label>
            <input type="email" class="form-control" name="supportEmail"  v-model="study.supportEmail" v-validate:email.initial="'required|email'" :class="{'input': true, 'is-danger': errors.has('supportEmail') }">
            <p class="text-danger" v-if="errors.has('supportEmail')">{{ errors.first('supportEmail') }}</p>
          </div>
          <div class="form-group" :class="{'has-error': errors.has('consent-notification-email') }">
            <label for="consent-notification-email">Consent Notification Email</label>
            <input type="email" class="form-control" name="consent-notification-email" v-model="study.consentNotificationEmail" v-validate:email.initial="'required|email'" :class="{'input': true, 'is-danger': errors.has('email') }">
            <p class="text-danger" v-if="errors.has('consent-notification-email')">{{ errors.first('consent-notification-email') }}</p>
          </div>
          <div class="form-group" :class="{'has-error': errors.has('technicalEmail') }">
            <label for="technicalEmail">Technical Email</label>
            <input type="email" class="form-control" name="technicalEmail"  v-model="study.technicalEmail" v-validate:email.initial="'required|email'" :class="{'input': true, 'is-danger': errors.has('technicalEmail') }">
            <p class="text-danger" v-if="errors.has('technicalEmail')">{{ errors.first('technicalEmail') }}</p>
          </div>

          <div class="form-group" :class="{'has-error': errors.has('sponsor-name') }">
            <label for="sponsor-name">Sponsor Name</label>
            <input type="name" name="sponsor-name" class="form-control" v-model="study.sponsorName" v-validate:name.initial="'required|alpha_dash'" :class="{'input': true, 'is-danger': errors.has('sponsor-name') }">
            <p class="text-danger" v-if="errors.has('sponsor-name')">{{ errors.first('sponsor-name') }}</p>
          </div>
        </form>
      </div>
      <div class="user-info">
        <h2>Users Information</h2>

        <div class="users" v-for="user in users">
          <form>
            <h3>User {{ users.indexOf(user) + 1 }}</h3>
            <div class="form-group" :class="{'has-error': errors.has('user-email') }">
              <label for="user-email">Email address</label>
              <input type="email" class="form-control" name="user-email" v-model="user.email" v-validate:email.initial="'required|email'" :class="{'input': true, 'is-danger': errors.has('user-email') }">
              <p class="text-danger" v-if="errors.has('user-email')">{{ errors.first('user-email') }}</p>
            </div>
            <div class="form-group" :class="{'has-error': errors.has('first-name') }">
              <label for="first-name">First Name</label>
              <input type="name" name="first-name" v-model="user.first_name" class="form-control" v-validate:name.initial="'required|alpha_dash'" :class="{'input': true, 'is-danger': errors.has('first-name') }">
              <p class="text-danger" v-if="errors.has('first-name')">{{ errors.first('first-name') }}</p>
            </div>
            <div class="form-group" :class="{'has-error': errors.has('last-name') }">
              <label for="last-name">Last Name</label>
              <input type="name" name="last-name" v-model="user.last_name" class="form-control" v-validate:name.initial="'required|alpha_dash'" :class="{'input': true, 'is-danger': errors.has('last-name') }">
              <p class="text-danger" v-if="errors.has('last-name')">{{ errors.first('last-name') }}</p>
            </div>
            <div class="form-group">
              <label for="roles" :class="{ 'error': errors.has('checked') }">User Roles</label>
              <div class="form-check" id="roles">
                <label class="form-check-label">
                  <input type="checkbox" class="form-check-input" v-model="user.role_researcher">
                  Researcher
                </label>
              </div>
              <div class="form-check" id="roles">
                <label class="form-check-label">
                  <input type="checkbox" class="form-check-input" v-model="user.role_dev">
                  Developer
                </label>
              </div>
            </div>
          </form>  
        </div>

        <button @click="addUser()" class="btn btn-primary" v-bind:class="{ disabled: loading }">
          Add More User
        </button>

        <button @click="removeOneUser()" class="btn btn-danger" v-bind:class="{ disabled: loading }">
          Remove One User
        </button>

      </div>
    </div>

    <hr>
    <div class="alert alert-danger" v-if="error">
      <p>{{ error }}</p>
    </div>
    <i v-if="loading" class="fa fa-circle-o-notch fa-spin" style="font-size:24px"></i>
    <button class="btn btn-primary" @click="validateForm()" v-bind:class="{ disabled: loading }">Create Study and User</button>
    <router-link to="/create-study"><button class="btn btn-danger">Cancel</button></router-link>    

  </div>
</template>

<script>
  import service from '../services/service'
  import config from '../config'
  const crypto = require('crypto')

  export default {
    data () {
      return {
        loading: false,
        error: '',
        email: '',
        name: '',
        phone: '',
        url: '',
        fakeemail: 'vermilion.lin@gmail.com',
        selectedAdmins: [],
        study: {
          identifier: '',
          supportEmail: '',
          consentNotificationEmail: '',
          technicalEmail: '',
          name: '',
          sponsorName: '',
          active: 'true'
        },
        users: [
          {
            email: '',
            first_name: '',
            last_name: '',
            password: crypto.randomBytes(8).toString('hex') + 'A=', // generate random password for each user
            role_researcher: false,
            role_dev: false
          }
        ]
      }
    },
    computed: {
      adminList: function () {
        return config.adminList
      }
    },
    methods: {
      validateForm () {
        this.error = ''

        // validation
        if (this.selectedAdmins.length === 0) {
          this.error = 'Must select at least one admin account.'
          return
        }

        for (var user in this.users) {
          if (!this.users[user].role_researcher && !this.users[user].role_dev) {
            this.error = 'Must select at least one role'
            return
          }
        }
        this.$validator.validateAll().then(success => {
          if (!success) {
            return
          }
          this.loading = true
          this.onSubmit()
        })
      },
      clearErrors () {
        this.errors.clear()
      },
      onSubmit () {
        // change roles to list
        for (var user in this.users) {
          var roles = []
          if (this.users[user].role_researcher) {
            roles.push('RESEARCHER')
          }
          if (this.users[user].role_dev) {
            roles.push('DEVELOPER')
          }
          this.users[user].roles = roles
        }
        service.createStudyAndUser(this, this.selectedAdmins, this.study, this.users, '/create-study').then(() => {
          this.loading = false
        })
      },
      addUser () {
        let user = {
          email: '',
          first_name: '',
          last_name: '',
          password: crypto.randomBytes(8).toString('hex') + 'A=',
          role_researcher: false,
          role_dev: false
        }
        this.users.push(user)
      },
      removeOneUser () {
        this.users.pop()
      }
    }
  }
</script>

<style>
</style>