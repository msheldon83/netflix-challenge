import uuidv4 from 'uuid/v4';
import EventSource from 'eventsource';
const MAX_VISIBLE_TWEETS = 100;

const emptyCard = {
    "name": "New Card",
    "query" : {
        "id": "",
        "conditions" : [
            {
                "field": "",
                "operator": "",
                "value": ""
            }
        ]
    },
    "tweets": [],
    "started": false
}

export default class AppService{
    
    constructor($http){
        this.$http = $http;
        this.$http.headers.common['content-type'] = 'application/json';
        this.connectionId = uuidv4();
        this.data = {
            "cards" : [],
            "languages" : []
        }
    }

    addCard(){
        this.data.cards.push(Object.assign({}, emptyCard))
    }

    deleteCard(index){
        this.data.cards.push(Object.assign({}, emptyCard))
    }

    addTweet(message){
        for(let qid of message.queryIds){
            let card = this.data.cards.find((c) => c.query.id == qid);
            this.addTweetToCard(message, card);
        }
    }

    addTweetToCard(message, card){
        card.tweets.unshift(message.tweet);
        if(cards.tweets.length > MAX_VISIBLE_TWEETS){
            card.tweets.pop();
        }
    }

    startQuery(card){
        let query = card.query;
        this.$http.post(`/connection/${this.connectionId}/queries`, query).then(
            (response) => { 
                query.Id = response.data; 
                card.started = true;
            },
            (response) => { throw 'Failed to start query.'}
        )
        this.startConnection();
    }

    stopQuery(card){
        let query = card.query;
        this.$http.delete(`/connection/${this.connectionId}/queries/${query.id}`).then(
            (response) => { 
                card.started = false;
            },
            (response) => { throw 'Failed to stop query.'}
        )

        let startedQueries = this.data.cards.reduce((result, c) => result && c.started, true);
        if(!startedQueries){
            stopConnection();
        }
    }

    startConnection(){
        if(this.eventSrc) return;
        
        let source = new EventSource(`/connection/${this.connectionId}`);
        var self = this;

        source.onmessage = function(e) {
            let message = JSON.parse(e.data);
            self.addTweet(message);
        };
        
        source.onerror = function(e) {
            if (e.readyState == EventSource.CLOSED) {
                // Connection was closed.
                // restart it
                // TODO add backoff time
                delete this.eventSrc
                self.startConnection();
            }
        };

        this.eventSrc = source;
    }

    stopConnection(){
        this.eventSrc.close();
        delete this.eventSrc;
    }

    getLanguages(){
        this.$http.get('/languages').then(
            (response) => { this.data.languages == response.data },
            (response) => { throw 'failed to retrieve languages'}
        )
    }

    startSimpleConnection(query, card){
        let queryStringified = JSON.stringify(query);
        let source = new EventSource(`/stream?query=${queryStringified}`);
        var self = this;

        source.onmessage = function(e) {
            let message = JSON.parse(e.data);
            self.addTweet(message);
        };
    }
}