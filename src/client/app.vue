<template>
    <div class="cards">
        <card  v-for="(card, index) in cards" 
            v-bind:card="card" 
            v-bind:index="index" 
            v-bind:key="card.query.id"  
            v-on:start="$emit('card-started', card)" 
            v-on:stop="$emit('card-stopped', card)"
            v-on:delete="$emit('card-deleted', card)"></card>
        <button v-on:click="$emit('card-added')">New Card</button>
    </div>
    
</template>

<script>
import Card from './card.vue'

export default {
    props: ['cards'],
    components: { Card },

}
</script>

<style scoped>
</style>