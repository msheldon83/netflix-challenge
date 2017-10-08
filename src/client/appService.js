import uuidv4 from 'uuid/v4';

const MAX_VISIBLE_TWEETS = 50;
const emptyCard = {
    "name": "New Card",
    "query": {
        "id": "",
        "conditions": [{
            "field": "tweet",
            "operator": "contains",
            "value": ""
        }]
    },
    "tweets": [],
    "started": false,
    "paused": false

}

export default class AppService {

    constructor($http) {
        this.$http = $http;
        this.$http.headers.common['content-type'] = 'application/json';
        this.connectionId = uuidv4();
        this.data = {
            "cards": [],
            "languages": []
        }
        this.addCard();
    }

    addCard() {
        if (this.data.cards.length == 5) {
            alert("Information overload!!! You may not add more than 5 search cards.");
            return;
        }
        this.data.cards.unshift(JSON.parse(JSON.stringify(emptyCard)));
    }

    deleteCard(index) {
        this.data.cards.splice(index, 1)
    }

    addTweet(message) {
        for (let qid of message.queryIds) {
            let card = this.data.cards.find((c) => c.query.id == qid && c.started && !c.paused);
            if (card) this.addTweetToCard(message, card);
        }
    }

    addTweetToCard(message, card) {
        card.tweets.unshift(message.tweet);
        if (card.tweets.length > MAX_VISIBLE_TWEETS) {
            card.tweets.pop();
        }
    }

    startQuery(card) {
        let query = card.query;

        card.started = true;
        card.paused = false;
        this.$http.post(`/connections/${this.connectionId}/queries`, query.conditions).then(
            (response) => {
                query.id = response.data;
            },
            (response) => {
                card.started = false;
                alert('Failed to start query. Please remove any blank conditions.');
            }
        )
        this.startConnection();
    }

    stopQuery(card, fullStop) {
        if (fullStop) {
            card.started = false;

            // if already paused then the query has already been removed
            if (card.paused) return;
        } else {
            card.paused = true;
        }

        this.$http.delete(`/connections/${this.connectionId}/queries/${card.query.id}`).then(
            (response) => {
                if (fullStop) {
                    card.tweets.length = 0;
                }

                let startedQueries = this.data.cards.some((c) => {
                    return c.started && !c.paused
                });
                if (!startedQueries) {
                    this.stopConnection();
                }
            },
            (response) => {
                if (fullStop) {
                    card.started = true;
                } else {
                    card.paused = false;
                }
                alert('Failed to stop query. Please try again.');
            }
        )


    }

    startConnection() {
        if (this.eventSrc) return;

        console.log("event source starting")
        let source = new EventSource(`/connections/${this.connectionId}`);
        var self = this;

        source.onmessage = function (e) {
            let message = JSON.parse(e.data);
            self.addTweet(message);
        };

        source.onerror = function (e) {
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

    stopConnection() {
        console.log("event source closing")
        this.eventSrc.close();
        delete this.eventSrc;
    }

    getLanguages() {
        this.$http.get('/languages').then(
            (response) => {
                this.data.languages == response.data
            },
            (response) => {
                throw 'failed to retrieve languages'
            }
        )
    }

    startSimpleConnection(query, card) {
        let queryStringified = JSON.stringify(query);
        let source = new EventSource(`/stream?query=${queryStringified}`);
        var self = this;

        source.onmessage = function (e) {
            let message = JSON.parse(e.data);
            self.addTweet(message);
        };
    }
}