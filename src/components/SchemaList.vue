<template>
    <div>
        <vue-toastr ref="toastr"></vue-toastr>
        <div class="ui negative message" v-if="error">
            <p>{{ error.message }}</p>
        </div>
        <div class="fixed-header">
            <div class="fixed-header-title">
                <div class="fixed-header-heading">
                    <h3>Schema List</h3>
                </div>
                <div class="fixed-header-buttons">
                    <button class="ui red tiny button" id="show-modal" @click="showDelete = true" :disabled="selectedSchemaIds.length === 0">
                        Delete
                    </button>
                </div>
            </div>
            <div class="ui empty secondary pointing menu">
            </div>
        </div>

        <div class="scrollbox">

            <p v-if="schemaList.length === 0"><strong>There are currently no schema</strong></p>

            <table class="ui compact selectable table">
                <thead>
                    <tr>
                        <th width="10">
                            <div class="ui fitted checkbox" id="roles">
                                <input type="checkbox" v-model="selectAll">
                                <label></label>
                            </div>
                        </th>
                        <th>Name</th>
                        <th>Identifier</th>
                        <th>Type</th>
                        <th>Last Revision</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="schema in schemaList">
                        <td>
                            <div class="ui fitted checkbox" id="roles">
                                <input type="checkbox" v-model="selectedSchemaIds" :value="schema.schemaId">
                                <label></label>
                            </div>
                        </td>
                        <td>
                            {{ schema.name }}
                        </td>
                        <td>
                            {{ schema.schemaId }}
                        </td>
                        <td>
                            {{ schema.schemaType }}
                        </td>
                        <td>
                            {{ schema.revision }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Delete Schema Modal Component -->
        <modal v-if="showDelete">
            <h3 slot="header">Delete Schema</h3>
            <div slot="body">
                <h4 v-if="this.selectedSchemaIds.length === 1">Are you sure you want to delete this schema?</h4>
                <h4 v-if="this.selectedSchemaIds.length !== 1">Are you sure you want to delete these schemas?</h4>
            </div>
            <div slot="footer">
                <button class="ui button" @click="showDelete = false">
                    Cancel
                </button>
                <button class="ui red button" @click="deleteSchema(true)" :class="{ loading: loading, disabled: loading }">
                    Delete
                </button>
            </div>
        </modal>
    </div>
</template>

<script>
    import service from '../services/service'
    import { mapState } from 'vuex'
    export default {
        data () {
            return {
                showDelete: false,
                loading: false,
                selectedSchemaIds: [],
                error: ''
            }
        },
        computed: {
            selectAll: {
                get: function () {
                    return this.schemaList ? this.selectedSchemaIds.length === this.schemaList.length : false;
                },
                set: function (value) {
                    var selected = [];
                    if (value) {
                        this.schemaList.forEach(function (schema) {
                            selected.push(schema.schemaId);
                        });
                    }

                    this.selectedSchemaIds = selected;
                }
            },
            ...mapState({schemaList: state => state.schemaList})
        },
        methods: {
            deleteSchema () {
                this.loading = true;
                var cxt = this;
                var errorStack = [];
                // async promise
                var promise = new Promise(function (resolve, reject) {
                    var completeRequest = 0;
                    for (var i in cxt.selectedSchemaIds) {
                        var schemaId = cxt.selectedSchemaIds[i];
                        service.deleteSchema(cxt, schemaId).then(() => {
                            if (cxt.error) {
                                errorStack.push(cxt.error.message);
                            } else {
                                cxt.$refs.toastr.s('Schema ' + schemaId + ' Deleted!');
                            }
                            completeRequest++;
                            if (completeRequest === cxt.selectedSchemaIds.length) {
                                if (errorStack.length === 0) {
                                    resolve('Done!');
                                } else {
                                    reject(Error(errorStack));
                                }
                            }
                        });
                    }
                });

                promise.then(function (result) {
                    // remove all element already deleted in selectedSchemaIds
                    cxt.selectedSchemaIds = [];
                    service.getSchemaList(cxt).then(() => {
                        cxt.loading = false;
                        cxt.showDelete = false;
                        cxt.showDeactivate = false;
                    });
                }, function (err) {
                    console.log(err);
                    cxt.$refs.toastr.Add({
                        title: 'Server Error', // Toast Title
                        msg: JSON.stringify(errorStack), // Message
                        clickClose: true, // Click Close Disable
                        timeout: 0, // Remember defaultTimeout is 5 sec..
                        position: 'toast-top-center', // Toast Position.
                        type: 'error' // Toast type
                    });
                    cxt.loading = false;
                });
            }
        },
        created () {
            service.getSchemaList(this);
        }
    }
</script>

<style>
</style>