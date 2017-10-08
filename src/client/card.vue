<template>
<div class="card">
    <div class="card-header">
        <input v-show="!card.started" class="h4 card-title" type="text" v-model="card.name">
        <h4 v-show="card.started">{{ card.name }}</h4>
    </div>
    <div class="query card-body" v-show="!card.started">
        <query-form :query="card.query"></query-form>
    </div>
    <div class="card-footer" v-show="!card.started">
        <div class="buttons">
            <button type="button" class="btn btn-secondary" v-on:click="$emit('delete', index)">Delete</button>
            <button type="button" class="btn btn-primary" v-on:click="$emit('start')">Start</button>
        </div>
    </div>
    <div class="tweets card-body" v-show="card.started">
        <ul class="list-group list-group-flush">
            <tweet v-for="(tweet, index) in card.tweets" :tweet="tweet" :key="index" ></tweet>
        </ul>
    </div>
    <div class="card-footer" v-show="card.started">
        <div class="buttons">
            <button v-show="!card.paused" type="button" class="btn btn-secondary" v-on:click="$emit('pause')">Pause</button>
            <button v-show="card.paused" type="button" class="btn btn-secondary" v-on:click="$emit('resume')">Resume</button>
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

<style>
    .card { width: 35em; display: inline-block; margin: 1em;}
    .card .card-header h4 { padding-bottom: 0.1em; }
    .card .buttons { text-align: right; }
    .card .card-body { height: 40em; overflow: scroll; padding: 1em;}
    .card .list-group-item { display: block; }
    .card .meta div { margin-right: 15px; float: left; font-size: 10px; color: #c0c0c0; }
</style>