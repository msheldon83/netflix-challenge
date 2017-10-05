<template>
<li class="list-group-item">
    <h6 class="card-subtitle">{{ tweet.tweet }}</h6>
    <div class="meta">
        <div class="user">{{ tweet.user }}</div>
        <div class="time">{{ date }}</div>
        <div class="lang">{{ tweet.lang }}</div>
        <div class="retweets">Retweets {{ tweet.retweet_count }}</div>
    </div>
</li>
</template>

<script>
module.exports = {
    props: ['tweet'],
    computed: {
        date: function(){ return new Date(this.tweet.created_at);}
    }
}
</script>

<style scoped>
    .meta div {
        
    }
</style>