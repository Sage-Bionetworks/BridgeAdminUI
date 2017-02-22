<template>
    <div class="create-one scrollbox">
        <h3>Create Study</h3>
        <div class="admin-info ui form">
            <h3 class="ui dividing header">Admin Information</h3>
            <label for="admin-list">Admin Accounts attached to this new Study</label>
            <multi-select :options="adminList" :selected-options="selectedAdmins" @select="onSelectAdmins" id="admin-list"></multi-select>
        </div>

        <br>

        <div class="study-info">
            <h3 class="ui dividing header">Study Information</h3>
            <form class="ui form"> 
                <div class="field" :class="{'error': $v.study.identifier.$error }">
                    <label for="study-id">Study ID</label>
                    <input type="text" @input="$v.study.identifier.$touch()" name="study-id" v-model="study.identifier">
                    <p class="ui pointing red basic tiny label" v-if="!$v.study.identifier.required">ID is required</p>
                </div>
                <div class="field" :class="{'error': $v.study.name.$error }">
                    <label for="study-name">Study Name</label>
                    <input type="text" @input="$v.study.name.$touch()" name="study-name" v-model="study.name" >
                    <p class="ui pointing red basic tiny label" v-if="!$v.study.name.required">Name is required</p>
                </div>
                <div class="form-group field" :class="{'error': $v.study.supportEmail.$error }">
                    <label for="supportEmail">Support Email</label>
                    <input type="email" @input="$v.study.supportEmail.$touch()" name="supportEmail"  v-model="study.supportEmail">
                    <p class="ui pointing red basic tiny label" v-if="!$v.study.supportEmail.required">Support Email is required</p>
                    <p class="ui pointing red basic tiny label" v-if="!$v.study.supportEmail.email">Email is invalid</p>
                </div>
                <div class="form-group field" :class="{'error': $v.study.consentNotificationEmail.$error }">
                    <label for="consent-notification-email">Consent Notification Email</label>
                    <input type="email" @input="$v.study.consentNotificationEmail.$touch()" name="consent-notification-email" v-model="study.consentNotificationEmail">
                    <p class="ui pointing red basic tiny label" v-if="!$v.study.consentNotificationEmail.required">ID is required</p>
                    <p class="ui pointing red basic tiny label" v-if="!$v.study.consentNotificationEmail.email">Email is invalid</p>
                </div>
                <div class="form-group field" :class="{'error': $v.study.technicalEmail.$error }">
                    <label for="technicalEmail">Technical Email</label>
                    <input type="email" @input="$v.study.technicalEmail.$touch()" name="technicalEmail"  v-model="study.technicalEmail">
                    <p class="ui pointing red basic tiny label" v-if="!$v.study.technicalEmail.required">ID is required</p>
                    <p class="ui pointing red basic tiny label" v-if="!$v.study.technicalEmail.email">Email is invalid</p>
                </div>

                <div class="form-group field" :class="{'error': $v.study.sponsorName.$error }">
                    <label for="sponsor-name">Sponsor Name</label>
                    <input type="text" @input="$v.study.sponsorName.$touch()" class="form-control" v-model="study.sponsorName">
                    <p class="ui pointing red basic tiny label" v-if="!$v.study.sponsorName.required">ID is required</p>
                </div>
            </form>
        </div>

        <br>

        <div class="user-info">
            <h3 class="ui dividing header">Users Information</h3>
            <div class="users" v-for="(user, idx) in users">
                <form class="ui form">
                    <h3>User {{ idx + 1 }}</h3>
                    <div class="field" :class="{'error': $v.users.$each[idx].email.$error }">
                        <label :for="'user-email' + idx">Email address</label>
                        <input type="email" @input="$v.users.$each[idx].email.$touch()" :name="'user-email' + idx" v-model="user.email">
                        <p class="ui pointing red basic tiny label" v-if="!$v.users.$each[idx].email.required">Email is required</p>
                        <p class="ui pointing red basic tiny label" v-if="!$v.users.$each[idx].email.email">Email is invalid</p>
                    </div>
                    <div class="field" :class="{'error': $v.users.$each[idx].first_name.$error }">
                        <label :for="'first-name' + idx">First Name</label>
                        <input type="text" @input="$v.users.$each[idx].first_name.$touch()" :name="'first-name' + idx" v-model="user.first_name">
                        <p class="ui pointing red basic tiny label" v-if="!$v.users.$each[idx].first_name.required">First Name is required</p>
                    </div>
                    <div class="form-group field" :class="{'error': $v.users.$each[idx].last_name.$error }">
                        <label :for="'last-name' + idx">Last Name</label>
                        <input type="text" @input="$v.users.$each[idx].last_name.$touch()" :name="'last-name' + idx" v-model="user.last_name">
                        <p class="ui pointing red basic tiny label" v-if="!$v.users.$each[idx].last_name.required">Last Name is required</p>
                    </div>
                    <div class="field">
                        <label for="roles">User Roles</label>
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
                    </div>
                </form>  
            </div>

            <br>

            <button @click="addUser()" class="ui blue tiny button" v-bind:class="{ loading: loading, disabled: loading }">
                Add More User
            </button>

            <button @click="removeOneUser()" class="ui red tiny button" v-bind:class="{ loading: loading, disabled: loading }">
                Remove One User
            </button>
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

        <br>

        <div class="ui error message" v-if="error">
            <p>{{ error }}</p>
        </div>
        <button class="ui blue button" @click="validateForm()" v-bind:class="{ loading: loading, disabled: loading }">Create Study and User</button>
        <router-link to="/study-list">
            <button class="ui red button">
                Cancel
            </button>
        </router-link>  
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
                        role_dev: false
                    }
                ],
                synapseDocs: 'http://docs.synapse.org/articles/getting_started.html'
            }
        },
        validations: {
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
