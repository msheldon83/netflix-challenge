import EventSource from 'eventsource';

class FireHose {
    constructor(resolver, url){
        this.resolver = resolver;
        this.url = url;
    }
    
    start(){
        if(this.eventSrc) return;

        let source = new EventSource(this.url);
        var self = this;

        source.onmessage = function(e) {
            let targets = self.resolver.resolveTargets(JSON.parse(e.data));
            targets.map((t) => {
                t.connection.sseSend({ message: e.data, queryIds: t.queryIds});
            });
        };
        
        source.onerror = function(e) {
            if (e.readyState == EventSource.CLOSED) {
                // Connection was closed.
                // restart it
                delete this.eventSrc
                self.start();
            }
        };

        this.eventSrc = source;
    }

    stop (){
        this.eventSrc.close();
        delete this.eventSrc;
    }
}

export default FireHose;