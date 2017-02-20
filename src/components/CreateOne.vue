<template>
    <div>
        <div class="create-one">
            <div class="admin-info ui form field">
                <h2>Admin Information</h2>
                <label for="admin-list">Admin Accounts attached to this new Study</label>
                <multi-select :options="adminList" :selected-options="selectedAdmins" @select="onSelectAdmins" id="admin-list"></multi-select>
            </div>
            <div class="study-info">
                <h2>Study Information</h2>
                <form class="ui form"> 
                    <div class="form-group required field" :class="{'error': errors.has('study-id') }">
                        <label for="study-id">Study ID</label>
                        <input type="text" class="form-control" name="study-id" v-model="study.identifier" v-validate:identifier.initial="'required|alpha_dash'" :class="{'input': true, 'error': errors.has('study-id') }">
                        <p class="ui pointing red basic label" v-if="errors.has('study-id')">{{ errors.first('study-id') }}</p>
                    </div>
                    <div class="form-group required field" :class="{'error': errors.has('study-name') }">
                        <label for="study-name">Study Name</label>
                        <input type="text" class="form-control" name="study-name" v-model="study.name" v-validate:name.initial="'required|alpha_dash'" :class="{'input': true, 'is-danger': errors.has('study-name') }">
                        <p class="ui pointing red basic label" v-if="errors.has('study-name')">{{ errors.first('study-name') }}</p>
                    </div>
                    <div class="form-group field" :class="{'error': errors.has('supportEmail') }">
                        <label for="supportEmail">Support Email</label>
                        <input type="email" class="form-control" name="supportEmail"  v-model="study.supportEmail" v-validate:email.initial="'required|email'" :class="{'input': true, 'is-danger': errors.has('supportEmail') }">
                        <p class="ui pointing red basic label" v-if="errors.has('supportEmail')">{{ errors.first('supportEmail') }}</p>
                    </div>
                    <div class="form-group field" :class="{'error': errors.has('consent-notification-email') }">
                        <label for="consent-notification-email">Consent Notification Email</label>
                        <input type="email" class="form-control" name="consent-notification-email" v-model="study.consentNotificationEmail" v-validate:email.initial="'required|email'" :class="{'input': true, 'is-danger': errors.has('email') }">
                        <p class="ui pointing red basic label" v-if="errors.has('consent-notification-email')">{{ errors.first('consent-notification-email') }}</p>
                    </div>
                    <div class="form-group field" :class="{'error': errors.has('technicalEmail') }">
                        <label for="technicalEmail">Technical Email</label>
                        <input type="email" class="form-control" name="technicalEmail"  v-model="study.technicalEmail" v-validate:email.initial="'required|email'" :class="{'input': true, 'is-danger': errors.has('technicalEmail') }">
                        <p class="ui pointing red basic label" v-if="errors.has('technicalEmail')">{{ errors.first('technicalEmail') }}</p>
                    </div>

                    <div class="form-group field" :class="{'error': errors.has('sponsor-name') }">
                        <label for="sponsor-name">Sponsor Name</label>
                        <input type="text" name="sponsor-name" class="form-control" v-model="study.sponsorName" v-validate:name.initial="'required|alpha_dash'" :class="{'input': true, 'is-danger': errors.has('sponsor-name') }">
                        <p class="ui pointing red basic label" v-if="errors.has('sponsor-name')">{{ errors.first('sponsor-name') }}</p>
                    </div>
                </form>
            </div>
            <div class="user-info">
                <h2>Users Information</h2>
                <div class="users" v-for="user in users">
                    <form class="ui form">
                        <h3>User {{ users.indexOf(user) + 1 }}</h3>
                        <div class="form-group field" :class="{'error': errors.has('user-email' + users.indexOf(user)) }">
                            <label :for="'user-email' + users.indexOf(user)">Email address</label>
                            <input type="email" class="form-control" :name="'user-email' + users.indexOf(user)" data-vv-as="User Email" v-model="user.email" v-validate:email.initial="'required|email'">
                            <p class="ui pointing red basic label" v-if="errors.has('user-email' + users.indexOf(user))">{{ errors.first('user-email' + users.indexOf(user)) }}</p>
                        </div>
                        <div class="form-group field" :class="{'error': errors.has('first-name' + users.indexOf(user)) }">
                            <label :for="'first-name' + users.indexOf(user)">First Name</label>
                            <input type="text" :name="'first-name' + users.indexOf(user)" data-vv-as="First Name" v-model="user.first_name" class="form-control" v-validate:name.initial="'required|alpha_dash'">
                            <p class="ui pointing red basic label" v-if="errors.has('first-name' + users.indexOf(user))">{{ errors.first('first-name' + users.indexOf(user)) }}</p>
                        </div>
                        <div class="form-group field" :class="{'error': errors.has('last-name' + users.indexOf(user)) }">
                            <label :for="'last-name' + users.indexOf(user)">Last Name</label>
                            <input type="text" :name="'last-name' + users.indexOf(user)" data-vv-as="Last Name" v-model="user.last_name" class="form-control" v-validate:name.initial="'required|alpha_dash'">
                            <p class="ui pointing red basic label" v-if="errors.has('last-name' + users.indexOf(user))">{{ errors.first('last-name' + users.indexOf(user)) }}</p>
                        </div>
                        <div class="form-group field">
                            <label for="roles" :class="{ 'error': errors.has('checked') }">User Roles</label>
                            <div class="form-check ui checkbox" id="roles">
                                <input type="checkbox" class="form-check-input" v-model="user.role_researcher">
                                <label>
                                    Researcher
                                </label>
                            </div>
                            <div class="form-check ui checkbox" id="roles">
                                <input type="checkbox" class="form-check-input" v-model="user.role_dev">
                                <label class="form-check-label">
                                    Developer
                                </label>
                            </div>
                        </div>
                    </form>  
                </div>

                <button @click="addUser()" class="ui blue tiny button" v-bind:class="{ disabled: loading }">
                    Add More User
                    <i v-if="loading" class="fa fa-circle-o-notch fa-spin" style="font-size:12px"></i>
                </button>

                <button @click="removeOneUser()" class="ui red tiny button" v-bind:class="{ disabled: loading }">
                    Remove One User
                    <i v-if="loading" class="fa fa-circle-o-notch fa-spin" style="font-size:12px"></i>
                </button>
            </div>
        </div>

        <hr>

        <div class="ui error message" v-if="error">
            <p>{{ error }}</p>
        </div>
        <i v-if="loading" class="fa fa-circle-o-notch fa-spin" style="font-size:24px"></i>
        <button class="ui blue button" @click="validateForm()" v-bind:class="{ disabled: loading }">Create Study and User</button>
        <router-link to="/study-list">
            <button class="ui red button">
                Cancel
                <i v-if="loading" class="fa fa-circle-o-notch fa-spin" style="font-size:12px"></i>
            </button>
        </router-link>    

    </div>
</template>

<script>
    import service from '../services/service';
    import config from '../config';
    const crypto = require('crypto');
    import { MultiSelect } from 'vue-search-select'

    export default {
        components: {
            MultiSelect
        },
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
                return config.adminList;
            }
        },
        methods: {
            onSelectAdmins (items, lastSelectItem) {
                this.selectedAdmins = items
                console.log(items)
            },
            validateForm () {
                this.error = '';

                // validation
                if (this.selectedAdmins.length === 0) {
                    this.error = 'Must select at least one admin account.';
                    return;
                }

                for (var user in this.users) {
                    if (!this.users[user].role_researcher && !this.users[user].role_dev) {
                        this.error = 'Must select at least one role';
                        return;
                    }
                }
                this.$validator.validateAll().then(success => {
                    if (!success) {
                        return;
                    }
                    this.loading = true;
                    this.onSubmit();
                })
            },
            clearErrors () {
                this.errors.clear();
            },
            onSubmit () {
                // change roles to list
                for (var user in this.users) {
                    var roles = [];
                    if (this.users[user].role_researcher) {
                        roles.push('RESEARCHER');
                    }
                    if (this.users[user].role_dev) {
                        roles.push('DEVELOPER');
                    }
                    this.users[user].roles = roles;
                }

                // extract value as list from selectedAdmins
                var selectedAdminIds = this.selectedAdmins.map((x) => {
                    return x.value;
                })
                service.createStudyAndUsers(this, selectedAdminIds, this.study, this.users, '/study-list').then(() => {
                    if (!this.error) {
                        this.$parent.$refs.toastr.s('Study Created!');
                        service.getStudyList(this.$parent);
                    } else {
                        this.$parent.$refs.toastr.e('Error Occurred!');
                    }
                    this.loading = false;
                });
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
                this.users.push(user);
            },
            removeOneUser () {
                this.users.pop();
            }
        }
    }
</script>

<!-- <style lang="sass">
@import "../assets/css/main.scss";
</style> -->