<template>
    <div class="create-one">
        <vue-toastr ref="toastr"></vue-toastr>
        <div class="ui negative message" v-if="error">
            <p>{{ error.message }}</p>
        </div>
        <div class="fixed-header">
            <div class="fixed-header-title">
                <div class="fixed-header-heading">
                    <div class="ui breadcrumb">
                        <router-link to="/study-list">
                            <a class="section">Studies</a>
                            <i class="right chevron icon divider"></i>
                        </router-link>
                    </div> 
                    <h3>Create Study</h3>
                </div>
                <div class="fixed-header-buttons">
                    <router-link to="/study-list">
                        <button class="ui red tiny button" v-bind:class="{ loading: loading, disabled: loading }">
                            Cancel
                        </button>
                    </router-link>  
                    <button class="ui blue tiny button" @click="validateForm()" v-bind:class="{ loading: loading, disabled: loading }">Create Study and User</button>
                </div>
            </div>
            <div class="ui empty secondary pointing menu">
            </div>
        </div>

        <div class="scrollbox">
            <div class="admin-info ui form">
                <h3 class="ui dividing header">Admin Information</h3>
                <div class="field" :class="{ 'error': $v.selectedAdmins.$error }">
                    <label for="admin-list">Admin Accounts attached to this new Study</label>
                    <multi-select :options="adminList" :selected-options="selectedAdmins" @select="onSelectAdmins" id="admin-list"></multi-select>
                    <p class="ui pointing red basic tiny label" v-if="!$v.selectedAdmins.required && $v.selectedAdmins.$error">Must select at least one admin</p>   
                </div>

            </div>

            <br>

            <div class="study-info">
                <h3 class="ui dividing header">Study Information</h3>
                <form class="ui form"> 
                    <div class="two fields">
                        <div class="field" :class="{'error': $v.study.identifier.$error }">
                            <label for="study-id">Study ID</label>
                            <input type="text" @input="$v.study.identifier.$touch()" name="study-id" v-model="study.identifier">
                            <p class="ui pointing red basic tiny label" v-if="!$v.study.identifier.required && $v.study.identifier.$error">ID is required</p>
                        </div>
                        <div class="field" :class="{'error': $v.study.name.$error }">
                            <label for="study-name">Study Name</label>
                            <input type="text" @input="$v.study.name.$touch()" name="study-name" v-model="study.name" >
                            <p class="ui pointing red basic tiny label" v-if="!$v.study.name.required && $v.study.name.$error">Name is required</p>
                        </div>                    
                    </div>

                    <div class="two fields">
                        <div class="field" :class="{'error': $v.study.consentNotificationEmail.$error }">
                            <label for="consent-notification-email">Consent Notification Email</label>
                            <input type="email" @input="$v.study.consentNotificationEmail.$touch()" name="consent-notification-email" v-model="study.consentNotificationEmail">
                            <p class="ui pointing red basic tiny label" v-if="!$v.study.consentNotificationEmail.required && $v.study.consentNotificationEmail.$error">ID is required</p>
                            <p class="ui pointing red basic tiny label" v-if="!$v.study.consentNotificationEmail.email && $v.study.consentNotificationEmail.$error">Email is invalid</p>
                        </div>
                        <div class="form-group field" :class="{'error': $v.study.technicalEmail.$error }">
                            <label for="technicalEmail">Technical Email</label>
                            <input type="email" @input="$v.study.technicalEmail.$touch()" name="technicalEmail"  v-model="study.technicalEmail">
                            <p class="ui pointing red basic tiny label" v-if="!$v.study.technicalEmail.required && $v.study.technicalEmail.$error">ID is required</p>
                            <p class="ui pointing red basic tiny label" v-if="!$v.study.technicalEmail.email && $v.study.technicalEmail.$error">Email is invalid</p>
                        </div> 
                    </div>

                    <div class="two fields">
                        <div class="form-group field" :class="{'error': $v.study.supportEmail.$error }">
                            <label for="supportEmail">Support Email</label>
                            <input type="email" @input="$v.study.supportEmail.$touch()" name="supportEmail"  v-model="study.supportEmail">
                            <p class="ui pointing red basic tiny label" v-if="!$v.study.supportEmail.required && $v.study.supportEmail.$error">Support Email is required</p>
                            <p class="ui pointing red basic tiny label" v-if="!$v.study.supportEmail.email && $v.study.supportEmail.$error">Email is invalid</p>
                        </div>
                        <div class="form-group field" :class="{'error': $v.study.sponsorName.$error }">
                            <label for="sponsor-name">Sponsor Name</label>
                            <input type="text" @input="$v.study.sponsorName.$touch()" class="form-control" v-model="study.sponsorName">
                            <p class="ui pointing red basic tiny label" v-if="!$v.study.sponsorName.required && $v.study.sponsorName.$error">ID is required</p>
                        </div>
                    </div>
                </form>
            </div>

            <br>

            <div class="user-info">
                <h3 class="ui dividing header">Users Information</h3>

                <div class="users" v-if="users.length === 0">
                    <p>No User Information</p>
                    <button @click="addUser()" class="ui primary tiny button" v-bind:class="{ loading: loading, disabled: loading }">
                        Add User
                    </button>
                </div>

                <div class="users" v-for="(user, idx) in users">
                    <form class="ui form field">
                        <div class="four fields">
                            <div class="field" :class="{'error': $v.users.$each[idx].email.$error }">
                                <input type="email" @input="$v.users.$each[idx].email.$touch()" :name="'user-email' + idx" v-model="user.email" placeholder="Email Address">
                                <p class="ui pointing red basic tiny label" v-if="!$v.users.$each[idx].email.required && $v.users.$each[idx].email.$error">Email is required</p>
                                <p class="ui pointing red basic tiny label" v-if="!$v.users.$each[idx].email.email && $v.users.$each[idx].email.$error">Email is invalid</p>
                            </div>

                            <div class="field" :class="{'error': $v.users.$each[idx].first_name.$error }">
                                <input type="text" @input="$v.users.$each[idx].first_name.$touch()" :name="'first-name' + idx" v-model="user.first_name" placeholder="First Name">
                                <p class="ui pointing red basic tiny label" v-if="!$v.users.$each[idx].first_name.required && $v.users.$each[idx].first_name.$error">First Name is required</p>
                            </div>
                            <div class="field" :class="{'error': $v.users.$each[idx].last_name.$error }">
                                <input type="text" @input="$v.users.$each[idx].last_name.$touch()" :name="'last-name' + idx" v-model="user.last_name" placeholder="Last Name">
                                <p class="ui pointing red basic tiny label" v-if="!$v.users.$each[idx].last_name.required && $v.users.$each[idx].last_name.$error">Last Name is required</p>
                            </div>

                            <div class="field user_info" :class="{ error: !user.role_researcher && !user.role_dev }">
                                <div class="activity-controls">
                                    <div class="ui checkbox" id="roles">
                                        <input type="checkbox" v-model="user.role_researcher">
                                        <label>
                                            Researcher
                                        </label>
                                    </div>
                                    <div class="ui checkbox" id="roles">
                                        <input type="checkbox" v-model="user.role_dev">
                                        <label class="form-check-label">
                                            Developer
                                        </label>
                                    </div>
                                    <p class="ui left pointing red basic tiny label" v-if="!user.role_researcher && !user.role_dev">Specify at least one role</p>
                                </div>
                            </div>

                            <div class="activity-controls">
                                <div @click="addUser()" class="ui icon compact positive basic mini button" data-tooltip="Add user below" v-bind:class="{ loading: loading, disabled: loading }">
                                  <i class="add icon"></i>
                                </div>
                                <div @click="removeOneUser()" class="ui icon compact negative basic mini button" data-tooltip="Remove user" v-bind:class="{ loading: loading, disabled: loading }">
                                  <i class="delete icon"></i>
                                </div>    
                            </div>
                        </div>
                    </form>  
                </div>
            </div>

            <br>

            <div class="email-template">
                <h3 class="ui dividing header">Email Template</h3>

                <p><strong>This is the email sent to users requesting them to join Synapse Team when they sign up for your study. </strong></p>

                <div class="ui message">
                    <p>Hi, </p>

                    <p>Thank you for creating a new Study. </p>

                    <p>This research study is powered by Bridge, a secure data storage service operated by Sage Bionetworks. In order to proceed, you must first create a Synapse account and request to join new Synapse Team related to new Study. Following are detailed steps:</p>

                    <ol>
                        <li>Click url in registration email from Synapse, follow instructions to signup a Synapse account, valid email address is needed;</li>

                        <li>After signup, sign in the Synapse and click (<a :href="teanUrl">this page</a>) to see new Syanpse Team: <strong><i>{{ teamName }}</i></strong> related to this new Study;</li>

                        <li>Click ‘Request to Join Team’ to send a request to join this new team;</li>
                    </ol>

                    <p>Our Study manager will accept the join request shortly. Then you will be able to get access to the new Synapse Team and new Synapse Project related to this new Study.</p>

                    <br>

                    <p>For general information about Synapse, Project and Team, refer to <a :href="synapseDocs">this docs</a>.</p>
                    <p>For general inquiries or to request support with your account, please email bridgeit@sagebase.org</p>

                    <br>

                    <p>Regards,</p>

                    <p>The Bridge Team</p>
                </div>
            </div>  
        </div>
    </div>
</template>

<script>
    import service from '../services/service';
    import config from '../config';
    const crypto = require('crypto');
    import { MultiSelect } from 'vue-search-select'
    import { required, email } from 'vuelidate/lib/validators'

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
                        role_dev: false,
                        selectedRoles: []
                    }
                ],
                synapseDocs: 'http://docs.synapse.org/articles/getting_started.html'
            }
        },
        validations: {
            selectedAdmins: {
                required
            },
            study: {
                identifier: {
                    required
                },
                supportEmail: {
                    required,
                    email
                },
                consentNotificationEmail: {
                    required,
                    email
                },
                technicalEmail: {
                    required,
                    email
                },
                name: {
                    required
                },
                sponsorName: {
                    required
                }
            },
            users: {
                $each: {
                    email: {
                        required,
                        email
                    },
                    first_name: {
                        required
                    },
                    last_name: {
                        required
                    }
                }
            }
        },
        computed: {
            adminList: function () {
                return config.adminList;
            },
            teamName: function () {
                return this.study.name.trim().replace(/\s/g, '_') + 'AccessTeam';
            },
            teanUrl: function () {
                return 'https://www.synapse.org/#!TeamSearch:' + this.teamName;
            },
            rolesList: function () {
                return config.rolesList;
            }
        },
        methods: {
            onSelectAdmins (items, lastSelectItem) {
                this.selectedAdmins = items
            },
            onSelectRoles (items, lastSelectItem) {
                console.log(items);
            },
            validateForm () {
                this.$v.$touch();
                if (this.$v.$error) {
                    return;
                }
                this.error = '';

                for (var user in this.users) {
                    if (!this.users[user].role_researcher && !this.users[user].role_dev) {
                        this.error = 'Must select at least one role';
                        return;
                    }
                }

                // finally create
                this.loading = true;
                this.onSubmit();
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
                service.createStudyAndUsers(this, selectedAdminIds, this.study, this.users).then(() => {
                    if (!this.error) {
                        this.$refs.toastr.s('Study Created!');
                        service.getStudyList(this.$parent);
                    } else {
                        this.$refs.toastr.e('Error Occurred!');
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
