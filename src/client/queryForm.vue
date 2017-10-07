<template>
    <div>
    <table>
        <thead>
            <tr>
                <th>Field</th>
                <th>Operator</th>
                <th>Value</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <condition v-for="(condition, index) in query.conditions" 
                v-bind:condition="condition" 
                v-bind:key="index"  
                v-on:remove="removeCondition(index)"></condition>
        </tbody>
    </table>
    <button type="button" class="btn btn-link" v-on:click="addCondition">+ Add</button>
    </div>
</template>

<script>
import Condition from './condition.vue'

export default {
    props: ['query'],
    components: { Condition },
    methods: {
        addCondition: function() {
            this.query.conditions.push( { field: "", operator: "", value: ""});
        },
        removeCondition: function(index) {
            this.query.conditions.splice(index, 1);
        }
    }
}
</script>

<style scoped>
</style>