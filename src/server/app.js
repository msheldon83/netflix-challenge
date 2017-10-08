import validQueryConditions from './queryValidator.js'

/**
 * This class is primarily a proxy, but handles negotiation between the repository and firehose
 */
class App {
    constructor(repository, fireHose) {
        this.repository = repository;
        this.fireHose = fireHose;
    }

    /**
     * Validate queryConditions.  Handles an array or a single condition
     * @param {Array|object} queryConditions 
     * @returns {boolean}
     */
    validQueryConditions(queryConditions) {
        let conditions = Array.isArray(queryConditions) ? queryConditions : [queryConditions];
        return validQueryConditions(conditions);
    }

    /**
     * Add a reference to this connection for the session
     * returns void
     * @param {object} connection SSE response object
     * @param {string} sid
     * @returns {void} 
     */
    addConnection(conn, sid) {
        return this.repository.addConnection(conn, sid);
    }

     /**
     * Get all the queries for a particular session
     * @param {string} sid sessionId
     * @returns {Array} Array of all queries for a particular session
     */
    getQueries(sid) {
        return this.repository.getQueries(sid);
    }

    /**
     * Create relationship between a query and a session
     * @param {Array} queryConditions Array of query conditions  
     * @param {*} sid sessionId
     * @returns {string} unique queryId (new or matched by signature)
     */
    addQuery(query, sid) {
        let response = this.repository.addQuery(query, sid);

        // Always try to start.  Firehose.start is idempotent
        this.fireHose.start();
        return response;
    }

    /**
     * Remove a relationship between a query and a connection based on the queryId
     * @param {string} id queryId
     * @param {string} sid sessionId
     * @returns {object} query that was removed
     */
    removeQueryById(qid, sid) {
        let response = this.repository.removeQueryById(qid, sid);

        // If there are no running queries then close the connection
        if (this.repository.getAllQueries().length == 0)
            this.fireHose.stop();

        return response;
    }


}

export default App;