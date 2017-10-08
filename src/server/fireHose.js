import EventSource from 'eventsource';

class FireHose {
    constructor(resolver, url, newEventSourceFn){
        this.resolver = resolver;
        this.url = url;
    }
    
    start(){
        if(this.eventSrc) return;

        let source = new EventSource(this.url);
        var self = this;

        source.onmessage = function(e) {
            let message = JSON.parse(e.data);
            let targets = self.resolver.resolveTargets(message);
            targets.map((t) => {
                t.connection.sseSend({ tweet: message, queryIds: t.queryIds});
            });
        };
        
        source.onerror = function(e) {
            if (e.readyState == EventSource.CLOSED) {
                // Connection was closed.
                // restart it
                // TODO add backoff time
                delete this.eventSrc
                self.start();
            }
        };

        this.eventSrc = source;
    }

    stop (){
        if(this.eventSrc){
            this.eventSrc.close();
            delete this.eventSrc;
        }
    }
}

export default FireHose;