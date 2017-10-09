import uuidv4 from 'uuid/v4';

/***********************
 * Private Functions
 ***********************/
function addQueryToQueries(q, queries) {
    queries[q.id] = q;
}

function addQuerySignature(q, signatures) {
    let key = querySignature(q.conditions);
    if (signatures[key] && signatures[key] != q.id)
        throw "Query signature already exists";

    signatures[key] = q.id;
}

function addQueryToSessions(q, sid, sessions) {

    sessions[sid] = sessions[sid] || new Set();
    sessions[sid].add(q.id);
}

function addQueryToSessionQueries(q, sid, sessionQueries) {
    sessionQueries[q.id] = sessionQueries[q.id] || new Set();
    sessionQueries[q.id].add(sid);
}

function removeQueryfromQueries(q, queries) {
    delete queries[q.id];
}

function removeQueryFromSessions(q, sid, sessions) {
    sessions[sid] = sessions[sid] || new Set();
    sessions[sid].delete(q.id);
}

function removeQueryFromSessionQueries(q, sid, sessionQueries) {
    sessionQueries[q.id] = sessionQueries[q.id] || new Set();
    sessionQueries[q.id].delete(sid);
    if (sessionQueries[q.id].size === 0)
        delete sessionQueries[q.id];

    return sessionQueries[q.id];
}

function removeQuerySignature(q, signatures) {
    let key = querySignature(q.conditions);
    delete signatures[key];
}

function findQueryId(conditions, signatures) {
    let c = Array.isArray(conditions) ? conditions : [conditions];
    let key = querySignature(c);
    return signatures[key];
}

function querySignature(conditions) {
    return JSON.stringify(conditions.sort(compareConditions));
}

function compareConditions(a, b) {
    let result = compareString(a.field, b.field);
    if (result == 0) result = compareString(a.operator, b.operator);
    if (result == 0) result = compareString(a.value, b.value);
    return result;
}

function compareString(a, b) {
    if (a > b) return -1;
    if (b > a) return 1;
    return 0;
}

function cleanupConditions(queryConditions) {
    let conditions = Array.isArray(queryConditions) ? queryConditions : [queryConditions];
    let conditionsWithRegexResolved = conditions.map((c) => {
        if (c.operator == "regex") {
            let reStr = c.value.replace(/(^\/)|(\/$)/g, "")
            return Object.assign({
                re: new RegExp(reStr)
            }, c);
        }
        return c;
    });
    return conditionsWithRegexResolved;

}

/**
 * Manage the data to be able to determine which queries match a tweet and which sessions need to be notified
 */
class Repository {
    constructor() {
        // Note: I chose to make the data representation to be more complex 
        //        to optimize for reads rather than writes

        // Map key = queryId, value = query object 
        this.queries = {};

        // Map key = querySignature (string), value = queryId
        this.querySignatures = {};

        // Map key = sessionId, value = array of queryIds
        this.sessions = {}

        // Map key = queryId, value = array of sessionIds
        this.sessionQueries = {}

        // Map key = sessionId, value = SSE connection
        this.connections = {}
    }

    /**
     * Add a reference to this connection for the session
     * returns void
     * @param {object} connection SSE response object
     * @param {string} sid
     * @returns {void} 
     */
    addConnection(connection, sid) { 
        this.connections[sid] = connection;
        return this.connections[sid];
    }

    /**
     * Remove the reference for the session's connection
     * @param {string} sid Session Id
     * @returns {object} SSE response object
     */
    removeConnection(sid) { 
        let conn = this.connections[sid];
        delete this.connections[sid];
        return conn;
    }

    /**
     * Get the reference for the session's connection
     * @param {string} sid Session Id
     * @returns {object} SSE response object
     */
    getConnection(sid) { // returns SSE connection
        return this.connections[sid];
    }

    /**
     * Create relationship between a query and a session
     * @param {Array} queryConditions Array of query conditions  
     * @param {*} sid sessionId
     * @returns {string} unique queryId (new or matched by signature)
     */
    addQuery(queryConditions, sid) { 
        let conditions = cleanupConditions(queryConditions);
        let id = findQueryId(conditions, this.querySignatures) || uuidv4();
        let q = {
            "id": id,
            conditions: conditions
        };

        addQuerySignature(q, this.querySignatures);
        addQueryToQueries(q, this.queries);
        addQueryToSessions(q, sid, this.sessions);
        addQueryToSessionQueries(q, sid, this.sessionQueries);

        return id;
    }

    /**
     * Remove a relationship between a query and a connection based on the queryId
     * @param {string} id queryId
     * @param {string} sid sessionId
     * @returns {object} query that was removed
     */
    removeQueryById(id, sid) {

        let q = this.queries[id];

        if (!q) return null;

        removeQueryFromSessions(q, sid, this.sessions);
        var sessionsRemain = removeQueryFromSessionQueries(q, sid, this.sessionQueries);
        if (!sessionsRemain) {
            removeQuerySignature(q, this.querySignatures);
            removeQueryfromQueries(q, this.queries);
        }
        return q;
    }

    /**
     * Remove a relationship between a query and a connection based on the query signature
     * @param {Array} queryConditions Array of query conditions
     * @param {string} sid sessionId
     * @returns {object} query that was removed
     */
    removeQuery(queryConditions, sid) { //returns query object
        let conditions = Array.isArray(queryConditions) ? queryConditions : [queryConditions];
        let id = findQueryId(conditions, this.querySignatures);
        if (!id) return;

        return this.removeQueryById(id, sid);
    }

    /**
     * Get all the queries for all sessions
     * @returns {Array} Array of all queries for all sessions
     */
    getAllQueries() { // returns array of query objects
        return Object.values(this.queries);
    }

    /**
     * Get all the queries for a particular session
     * @param {string} sid sessionId
     * @returns {Array} Array of all queries for a particular session
     */
    getQueries(sid) { // returns array of query objects
        let set = this.sessions[sid];

        if (set) {
            let values = [...set.values()];
            return values.map(id => this.queries[id]);
        }

        return [];
    }

    /**
     * Get a list of sessionIds related to a query
     * @param {string} queryId queryId
     * @returns {Array} An array of sessionIds that have this query open
     */
    getSids(queryId) { // returns array of strings
        let set = this.sessionQueries[queryId];
        if (set)
            return [...set.values()]

        return [];
    }


}

export default Repository;