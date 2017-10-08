/**
 * Match a message to an array of conditions
 * @param {object} message message from the netflix event stream in the form of { "tweet" : "string", "user" : "string", "language": "string"}
 * @param {Array} conditions Array of query conditions
 * @returns {boolean} True if the message matches all of the conditions
 */
export function match(message, conditions) {
    var q = Array.isArray(conditions) ? conditions : [conditions];
    return q.every((c) => matchCondition(message, c));
}

function matchCondition(message, condition) {
    let value = message[condition.field];
    if (value == undefined) return false;

    let re = condition.operator == "regex" && condition.re ? condition.re : new RegExp(condition.value);

    switch (condition.operator) {
        case "equals":
            return value == condition.value;
        case "contains":
            return value.includes(condition.value);
        case "regex":
            return re.test(value);
        default:
            return false
    }
}

/**
 * Get the querys that that match a message
 * @param {object} message 
 * @param {Array} allQueries 
 * @returns {Array} Array of queryIds
 */
function matchedQueries(message, allQueries) { // returns [ queryIds ]
    return Object.values(allQueries)
        .filter((q) => match(message, q.conditions))
        .map((q) => q.id);
}

/**
 * Resolve which sessions match an array of queries
 * @param {Array} queryIds Array of queryIds
 * @param {object} repository Instance of Repository class
 * @returns {Array} Array of pairs of sessionId and queryId [ { sid : string, qid : string }]
 */
function enumerateSessionQueries(queryIds, repository) { 

    return queryIds.reduce((result, qid) => {
        let sids = repository.getSids(qid);
        let pairs = sids.map((sid) => {
            return {
                sid: sid,
                qid: qid
            }
        });
        return result.concat(pairs);
    }, []);
}

/**
 * Group sessionId, queryId pairs by sessionId
 * @param {Array} sessionQueryPairs Array of pairs of sessionId and queryId [ { sid : string, qid : string }]
 * @returns {Array} Array of pairs of sessionId and list of queries [ { sid: string, queryIds: [ string ]} ]
 */
function reduceSessionQueriesBySid(sessionQueryPairs) { 
    let sessionMap = sessionQueryPairs.reduce((result, p) => {
        result[p.sid] = result[p.sid] || {
            sid: p.sid,
            queryIds: []
        };
        result[p.sid].queryIds.push(p.qid);
        return result;
    }, {});
    return Object.values(sessionMap);
}

/**
 * Add connection attribute to each element as looked up by sessionId
 * @param {Array} reducedSessionQueries Array of pairs of sessionId and list of queries [ { sid: string, queryIds: [ string ]} ]
 * @param {object} repository Instance of Repository class
 * @returns {Array} [ { sid: string, queryIds: [ string ], connection: responseObjectForSSE} ]
 */
function convertSessionQueriesToConnectionQueries(reducedSessionQueries, repository) { 
    return reducedSessionQueries.map((x) => Object.assign({
        connection: repository.getConnection(x.sid)
    }, x));
}

/**
 * Logic to determine which connections should be sent a tweet
 */
export class Resolver {
    constructor(repository) {
        this.repository = repository;
    }

    
    /**
     * Given a message find the connections that need to have the message written out
     * @param {object} message message from the netflix event stream in the form of { "tweet" : "string", "user" : "string", "language": "string"}
     * @returns {Array} [ { connection: object, queryIds: [string] }]
     */
    resolveTargets(message) { 
        // NOTE: This would be a good place for functional composition, 
        //  but seemed like overkill to bring in a whole library for just this case
        return convertSessionQueriesToConnectionQueries(
            reduceSessionQueriesBySid(
                enumerateSessionQueries(
                    matchedQueries(message, this.repository.getAllQueries()), this.repository
                )
            ), this.repository
        ).filter((x) => x.connection != undefined);
    }
}