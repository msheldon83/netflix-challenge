<template>
<div class="card w-50">
    <div class="card-header">
        <input v-show="!card.started" class="h4 card-title" type="text" v-model="card.name">
        <h4 v-show="card.started">{{ card.name }}</h4>
    </div>
    <div class="query card-body" v-show="!card.started">
        <query-form :query="card.query"></query-form>
        <div class="buttons">
            <button type="button" class="btn btn-secondary" v-on:click="$emit('delete', index)">Stop</button>
            <button type="button" class="btn btn-primary" v-on:click="$emit('start')">Start</button>
        </div>
    </div>
    <div class="tweets card-body" v-show="card.started">
        <ul class="list-group list-group-flush">
            <tweet v-for="(tweet, index) in card.tweets" :tweet="tweet" :key="index" ></tweet>
        </ul>
        <div class="buttons">
            <button type="button" class="btn btn-danger" v-on:click="$emit('stop')">Stop</button>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import queryForm from './queryForm.vue'
import tweet from './tweet.vue'
export default {
    props: ['card', 'index'],
    components: { queryForm, tweet }
}
</script>

<style scoped>
    .buttons { text-align: right; }
</style>