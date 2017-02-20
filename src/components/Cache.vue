<template>
    <div>
        <div class="fixed-header">
            <div class="fixed-header-title">
                <div class="fixed-header-heading">
                    <h3>Cache Control</h3>
                </div>
                <div class="fixed-header-buttons">
                    <router-link to="/create-study/delete-study"><button
                        v-if="$route.path !== '/create-study/create-one'"
                        class="ui red tiny button">
                        Delete
                    </button></router-link>
                    <router-link to="/create-study/create-one"><button
                        v-if="$route.path !== '/create-study/create-one'"
                        class="ui primary tiny button">
                        Create One
                    </button></router-link>

                </div>
            </div>
            <div class="ui empty secondary pointing menu">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['deleted']
    }
</script>