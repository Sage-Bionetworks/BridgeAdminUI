<template>
    <div>
        <vue-toastr ref="toastr"></vue-toastr>
        <div class="ui negative message" v-if="error">
            <p>{{ error.message }}</p>
        </div>
        <div class="fixed-header">
            <div class="fixed-header-title">
                <div class="fixed-header-heading">
                    <h3>Cache Control</h3>
                </div>
                <div class="fixed-header-buttons">
                    <button class="ui red tiny button" 
                        :disabled="selectedKeys.length === 0" 
                        @click="showDelete = true">
                        Delete
                    </button>
                    <button class="ui tiny button" 
                        @click="showDeleteAll = true">
                        Sign Out Everyone
                    </button>
                </div>
            </div>
            <div class="ui empty secondary pointing menu">
            </div>
        </div>

        <div class="scrollbox">

            <p v-if="cacheKeys.length === 0 && loading === true"><strong>Loading Cache List...</strong></p>

            <table class="ui compact selectable table">
                <thead>
                    <tr>
                        <th width="10">
                        </th>
                        <th>Cache Key</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cache in cacheKeys">
                        <td>
                            <div class="ui fitted checkbox" id="keys">
                                <input type="checkbox" v-model="selectedKeys" :value="cache">
                                <label></label>
                            </div>
                        </td>
                        <td>
                            {{ cache }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <modal v-if="showDelete">
            <h3 slot="header">Delete Cache</h3>
            <div slot="body">
                <h4 v-if="this.selectedKeys.length === 1">Are you sure you want to delete this cache key?</h4>
                <h4 v-if="this.selectedKeys.length !== 1">Are you sure you want to delete these cache keys?</h4>
            </div>
            <div slot="footer">
                <button class="ui button" @click="showDelete = false">
                    Cancel
                </button>
                <button class="ui red button" 
                    @click="deleteKeys(selectedKeys)" 
                    :class="{ loading: this.loading, disabled: this.loading }">
                    Delete
                </button>
            </div>
        </modal>
        <modal v-if="showDeleteAll">
            <h3 slot="header">Delete All Cache</h3>
            <div slot="body">
                <h4>Are you sure you want to sign out everyone?</h4>
            </div>
            <div slot="footer">
                <button class="ui button" @click="showDeleteAll = false">
                    Cancel
                </button>
                <button class="ui red button" 
                    @click="deleteKeys(cacheKeys)" 
                    :class="{ loading: this.loading, disabled: this.loading }">
                    Sign everyone out
                </button>
            </div>
        </modal>
    </div>
</template>

<script>
    import service from '../services/service'

    export default {
        data () {
            return {
                selectedKeys: [],
                cacheKeys: [],
                loading: false,
                showDeleteAll: false,
                showDelete: false,
                error: ''
            }
        },
        methods: {
            deleteKeys (keys) {
                if (keys.length === 0) {
                    return;
                }
                this.loading = true;
                var cxt = this;
                var errorStack = [];
                // async promise
                var promise = new Promise(function (resolve, reject) {
                    var completeRequest = 0;
                    for (var i in keys) {
                        var key = keys[i];
                        service.deleteKey(cxt, key).then(() => {
                            if (cxt.error) {
                                errorStack.push(cxt.error.message);
                            } else {
                                cxt.$refs.toastr.s('Cache ' + key + ' Deleted!');
                            }
                            completeRequest++;
                            if (completeRequest === keys.length) {
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
                    cxt.selectedKeys = [];
                    service.getCacheKeys(cxt).then(() => {
                        cxt.loading = false;
                        cxt.showDelete = false;
                        cxt.showDeleteAll = false;
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
        mounted () {
            this.loading = true;
            service.getCacheKeys(this).then(() => {
                this.loading = false;
            });
        }
    }
</script>