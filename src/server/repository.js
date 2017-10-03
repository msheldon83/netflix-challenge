const uuidv4 = require('uuid/v4');

function addQueryToQueries(q, queries){
    queries[q.id] = q;
}

function removeId(o){
    let objectWithoutId = Object.assign({}, o);
    delete objectWithoutId.id;
    return objectWithoutId;
}

function addQuerySignature(q, signatures){
    let key = querySignature(q);
    if(signatures[key] && signatures[key] != q.id)
        throw "Query signature already exists";
    
    signatures[key] = q.id;
}

function addQueryToSessions(q, sid, sessions){

    sessions[sid] = sessions[sid] || new Set();
    sessions[sid].add(q.id);
}

function addQueryToSessionQueries(q, sid, sessionQueries){
    sessionQueries[q.id] = sessionQueries[q.id] || new Set();
    sessionQueries[q.id].add(sid);
}

function removeQueryfromQueries(q, queries){
    delete queries[q.id];
}

function removeQueryFromSessions(q, sid, sessions){
    sessions[sid] = sessions[sid] || new Set();
    sessions[sid].delete(q.id);
}

function removeQueryFromSessionQueries(q, sid, sessionQueries){
    sessionQueries[q.id] = sessionQueries[q.id] || new Set();
    sessionQueries[q.id].delete(sid); 
    if(sessionQueries[q.id].size === 0)
        delete sessionQueries[q.id];

    return sessionQueries[q.id];
}

function removeQuerySignature(q, signatures){
    let key = querySignature(q);
    delete signatures[key];
}

function findQueryId(query, signatures){
    let key = querySignature(query);
    return signatures[key];
}

function querySignature(query){
    let queryWithoutId = removeId(query);
    return JSON.stringify(queryWithoutId);
}

// Note: I chose to make the data representation to be more complex 
//       to optimize for reads rather than writes
class Repository{
    constructor(){
        this.queries = {};
        this.querySignatures = {};
        this.sessions = {}
        this.sessionQueries = {}
        this.connections = {}
    }

    addConnection(connection, sid){ // returns void
        this.connections[sid] = connection;
        return this.connections[sid];
    }

    removeConnection(sid){  // returns SSE connection
        let conn = this.connections[sid];
        delete this.connections[sid];
        return conn;
    }

    getConnection(sid){ // returns SSE connection
        return this.connections[sid];
    }
    
    addQuery(query, sid){  //returns queryId
        let id = findQueryId(query, this.querySignatures) || uuidv4();
        let q = Object.assign({ "id" : id }, query);

        addQuerySignature(q, this.querySignatures);
        addQueryToQueries(q, this.queries);
        addQueryToSessions(q, sid, this.sessions);
        addQueryToSessionQueries(q, sid, this.sessionQueries);

        return id;
    }

    removeQueryById(id, sid) {

        let q = this.queries[id];

        removeQueryFromSessions(q, sid, this.sessions);
        var sessionsRemain = removeQueryFromSessionQueries(q, sid, this.sessionQueries);
        if (!sessionsRemain){
            removeQuerySignature(q, this.querySignatures);
            removeQueryfromQueries( q, this.queries );
        }
        return q;
    }

    removeQuery(query, sid){ //returns query object
        let id = findQueryId(query, this.querySignatures);
        if(!id) return;

        return this.removeQueryById(id, sid);
    }

    getAllQueries(){ // returns array of query objects
        return Object.values(this.queries);
    }

    getQueries(sid){ // returns array of query objects
        let set = this.sessions[sid];

        if (set){
            let values = [... set.values()];
            return values.map( id => this.queries[id]);
        }
        
        return [];
    }

    getSids(queryId){ // returns array of strings
        let set = this.sessionQueries[queryId];
        if(set) 
            return [... set.values() ] 

        return [];
    }


}

// query object structure
/*
{
    id: string,
    field: string, 
    operator: ['equals', 'contains', 'regex'],
    value: string
}
*/

export default Repository;