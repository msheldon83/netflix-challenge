import Vue from 'vue'
import App from './app.vue'

new Vue({
    el: '#app',
    data: {
            "cards" : [
                {
                    "name": "testCard",
                    "query" : {
                        "id": "abcd123",
                        "conditions" : [
                            {
                                "field": "tweet",
                                "operator": "contains",
                                "value": "X"
                            }
                        ]
                    },
                    "tweets": [ 
                        {"tweet":"daredevil awesome. #greatshow","user":"user-10","retweet_count":75,"created_at":1470424244752,"verified":false,"lang":"en"},
                        {"tweet":"narcos rocks. #greatshow","user":"user-13","retweet_count":449,"created_at":1470424244752,"verified":false,"lang":"es"}
                    ],
                    "started": true
        
                }
            ]
        },
        components: { App }
    })