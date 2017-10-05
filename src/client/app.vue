<template>
    <div class="cards">
        <card  v-for="card in cards" v-bind:card="card" v-bind:key="card.query.id"></card>
    </div>
</template>

<script>
import Card from './card.vue'

export default {
    props: ['cards'],
    components: { Card }
}
</script>

<style scoped>
</style>