<template>
    <div class="create-one">
        <vue-toastr ref="toastr"></vue-toastr>
        <div class="fixed-header">
            <div class="fixed-header-title">
                <div class="fixed-header-heading">
                    <div class="ui breadcrumb">
                        <router-link to="/study-list">
                            <a class="section">Studies</a>
                            <i class="right chevron icon divider"></i>
                        </router-link>
                    </div> 
                    <h3>New Study</h3>
                </div>
                <div class="fixed-header-buttons">
                    <button class="ui blue tiny button" @click="validateForm()" v-bind:class="{ loading: loading, disabled: loading }">Save</button>
                </div>
            </div>
            <div class="ui empty secondary pointing menu">
            </div>
        </div>
        <div class="scrollbox">
            <div class="ui negative message" v-if="error">
                <p>{{ error.message }}</p>
            </div>
            <div v-if="!isCreated">
                <div class="study-info" style="margin-bottom: 2rem">
                    <h3 class="ui dividing header">Study Information</h3>
                    <form class="ui form"> 
                        <div class="two fields">
                            <div class="field" :class="{'error': $v.study.name.$error }">
                                <label for="study-name">Study Name</label>
                                <input type="text" @input="$v.study.name.$touch()" name="study-name" v-model="study.name" >
                                <p class="ui pointing red basic tiny label" v-if="!$v.study.name.required && $v.study.name.$error">Name is required</p>
                            </div>                    
                            <div class="form-group field" :class="{'error': $v.study.supportEmail.$error }">
                                <label for="supportEmail">Support Email</label>
                                <input type="email" @input="$v.study.supportEmail.$touch()" name="supportEmail"  v-model="study.supportEmail">
                                <p class="ui pointing red basic tiny label" v-if="!$v.study.supportEmail.required && $v.study.supportEmail.$error">Support Email is required</p>
                                <p class="ui pointing red basic tiny label" v-if="!$v.study.supportEmail.email && $v.study.supportEmail.$error">Email is invalid</p>
                            </div>
                        </div>

                        <div class="two fields">
                            <div class="form-group field" :class="{'error': $v.study.sponsorName.$error }">
                                <label for="sponsor-name">Sponsor Name</label>
                                <input type="text" @input="$v.study.sponsorName.$touch()" class="form-control" v-model="study.sponsorName">
                                <p class="ui pointing red basic tiny label" v-if="!$v.study.sponsorName.required && $v.study.sponsorName.$error">ID is required</p>
                            </div>
                            <div class="form-group field" :class="{'error': $v.study.technicalEmail.$error }">
                                <label for="technicalEmail">Technical Email</label>
                                <input type="email" @input="$v.study.technicalEmail.$touch()" name="technicalEmail"  v-model="study.technicalEmail">
                                <p class="ui pointing red basic tiny label" v-if="!$v.study.technicalEmail.required && $v.study.technicalEmail.$error">ID is required</p>
                                <p class="ui pointing red basic tiny label" v-if="!$v.study.technicalEmail.email && $v.study.technicalEmail.$error">Email is invalid</p>
                            </div> 
                        </div>

                        <div class="two fields">
                            <div class="field" :class="{'error': $v.study.identifier.$error }">
                                <label for="study-id">Study ID</label>
                                <input type="text" @input="$v.study.identifier.$touch()" name="study-id" v-model="study.identifier">
                                <p class="ui pointing red basic tiny label" v-if="!$v.study.identifier.required && $v.study.identifier.$error">ID is required</p>
                            </div>
                            <div class="field" :class="{'error': $v.study.consentNotificationEmail.$error }">
                                <label for="consent-notification-email">Consent Notification Email</label>
                                <input type="email" @input="$v.study.consentNotificationEmail.$touch()" name="consent-notification-email" v-model="study.consentNotificationEmail">
                                <p class="ui pointing red basic tiny label" v-if="!$v.study.consentNotificationEmail.required && $v.study.consentNotificationEmail.$error">ID is required</p>
                                <p class="ui pointing red basic tiny label" v-if="!$v.study.consentNotificationEmail.email && $v.study.consentNotificationEmail.$error">Email is invalid</p>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="user-info">
                    <h3 class="ui dividing header">Bridge Study Administrators</h3>

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

                                <div class="field" :class="{'error': $v.users.$each[idx].firstName.$error }">
                                    <input type="text" @input="$v.users.$each[idx].firstName.$touch()" :name="'first-name' + idx" v-model="user.firstName" placeholder="First Name">
                                    <p class="ui pointing red basic tiny label" v-if="!$v.users.$each[idx].firstName.required && $v.users.$each[idx].firstName.$error">First Name is required</p>
                                </div>
                                <div class="field" :class="{'error': $v.users.$each[idx].lastName.$error }">
                                    <input type="text" @input="$v.users.$each[idx].lastName.$touch()" :name="'last-name' + idx" v-model="user.lastName" placeholder="Last Name">
                                    <p class="ui pointing red basic tiny label" v-if="!$v.users.$each[idx].lastName.required && $v.users.$each[idx].lastName.$error">Last Name is required</p>
                                </div>

                                <div class="field" :class="{ error: !user.role_researcher && !user.role_dev }">
                                    <div class="two role_info fields">
                                        <div class="field ui checkbox">
                                            <input type="checkbox" :id="'researcher' + idx" v-model="user.role_researcher">
                                            <label :for="'researcher' + idx">
                                                Researcher
                                            </label>
                                            <div></div>
                                        </div>
                                        <div class="field ui checkbox">
                                            <input type="checkbox" :id="'developer' + idx" v-model="user.role_dev">
                                            <label :for="'developer' + idx" class="form-check-label">
                                                Developer
                                            </label>
                                        </div>
                                    </div>
                                    <p class="ui pointing red basic tiny label" v-if="!user.role_researcher && !user.role_dev">Specify at least one role</p>
                                </div>

                                <div class="activity-controls role_info">
                                    <div @click="addUser()" class="ui icon compact positive basic mini button" data-tooltip="Add user below" v-bind:class="{ loading: loading, disabled: loading }">
                                      <i class="add icon"></i>
                                    </div>
                                    <div @click="removeOneUser(idx)" class="ui icon compact negative basic mini button" data-tooltip="Remove user" v-bind:class="{ loading: loading, disabled: loading }">
                                      <i class="delete icon"></i>
                                    </div>    
                                </div>
                            </div>
                        </form>  
                    </div>
                </div>

                <div class="admin-info ui form" style="margin-bottom: 2rem">
                    <h3 class="ui dividing header">Synapse Team Management</h3>
                    <div class="field" :class="{ 'error': $v.selectedAdmins.$error }">
                        <label for="admin-list">Team administrators for the Synapse project team</label>
                        <multi-select :options="adminList" :selected-options="selectedAdmins" @select="onSelectAdmins" id="admin-list"></multi-select>
                        <p class="ui pointing red basic tiny label" v-if="!$v.selectedAdmins.required && $v.selectedAdmins.$error">Must select at least one admin</p>   
                    </div>
                </div>
            </div>

            <div class="email-template" v-if="isCreated">
                <h3 class="ui dividing header">Email Template</h3>

                <p><i>You can cut-and-paste this message into an email for each user you just added to the study. It provides further instructions on how they can get set up to use their project. </i></p>

                <div class="ui message" v-for="(user, idx) in users">
                    <p><code>Subject:</code> Welcome to Bridge</p>
                    <p><code>Recipient:</code> {{user.email}}</p>

                    <br>

                    <p>Hi {{ user.firstName }}, </p>

                    <p>We have created <strong><i>{{ study.name }}</i></strong>, which is your new study.</p>

                    <p>This research study is powered by Bridge, a secure data storage service operated by Sage Bionetworks. In order to proceed, you must first create a Synapse account and request to join the team for the Synapse project that will house your study's data. Follow these steps:</p>

                    <ol>
                        <li>Click the url in registration email from Synapse, and follow instructions to create a Synapse account using the email address <strong><i>{{ user.email }}</i></strong>;</li>

                        <li>After creating an account, sign in to Synapse and click <a :href="teamUrl">this page</a> to see new Synapse team: <strong><i>{{ teamName }}</i></strong> for your study;</li>

                        <li>Click ‘Request to Join Team’ to send a request to join this new team.</li>
                    </ol>

                    <p>A temporary project administrator will add you to the study team as soon as possible. You will then be able to access to the project and the data related to your study. </p>

                    <p>For general information about Synapse, we refer to <a :href="synapseDocs">the Synapse documentation</a>.</p>

                    <br>

                    <p>Meanwhile, you have an account as a developer and/or researcher in the <a :href="researcherUI">Bridge Study Manager</a>, using your email address {{ user.email }}. We will have sent you a reset password link to set your password for the Study Manager.</p>

                    <p>For general information about the Bridge Study Manager, Bridge APIs, and SDKs, see the <a :href="bridgeDocs">Bridge documentation</a>.</p>

                    <br>

                    <p>For general inquiries or to request support with your account, please email bridgeit@sagebase.org</p>

                    <br>

                    <p>Thank you,</p>

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
                    active: true,
                    emailVerificationEnabled: true
                },
                users: [
                    {
                        email: '',
                        firstName: '',
                        lastName: '',
                        password: crypto.randomBytes(8).toString('hex') + 'A=', // generate random password for each user
                        role_researcher: false,
                        role_dev: true,
                        selectedRoles: []
                    }
                ],
                synapseDocs: 'http://docs.synapse.org/articles/getting_started.html',
                researcherUI: 'https://research.sagebridge.org',
                bridgeDocs: 'https://developer.sagebridge.org',
                isCreated: false
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
                    firstName: {
                        required
                    },
                    lastName: {
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
            teamUrl: function () {
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
                        this.isCreated = true;
                    } else {
                        this.$refs.toastr.e('Error Occurred!');
                    }
                    this.loading = false;
                });
            },
            addUser () {
                let user = {
                    email: '',
                    firstName: '',
                    lastName: '',
                    password: crypto.randomBytes(8).toString('hex') + 'A=',
                    role_researcher: false,
                    role_dev: false
                }
                this.users.push(user);
            },
            removeOneUser (index) {
                this.users.splice(index, 1);
            }
        }
    }
</script>
