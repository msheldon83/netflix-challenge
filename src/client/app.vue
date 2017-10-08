<template>
    <div>
        <header>
            <h1>Netflix Tweet Query UI</h1>
            <button type="button" class="btn btn-primary" v-on:click ="$emit('card-added')"> Add New Search Card</button>
        </header>
        <div class="cards">
            <card  v-for="(card, index) in cards" 
                v-bind:card="card" 
                v-bind:index="index" 
                v-bind:key="card.query.id"  
                v-on:start="$emit('card-started', card)" 
                v-on:stop="$emit('card-stopped', card)"
                v-on:pause="$emit('card-paused', card)"
                v-on:resume="$emit('card-resumed', card)"
                v-on:delete="$emit('card-deleted', index)"></card>
        </div>
    </div>
</template>

<script>
import Card from './card.vue'

export default {
    props: ['cards'],
    components: { Card },

}
</script>

<style>
    header { margin: 1em; }
    .cards { white-space: nowrap; }
</style>