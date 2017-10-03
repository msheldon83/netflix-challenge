export function match(message, query){  // returns bool
    var q = Array.isArray(query) ? query : [ query ];
    return q.reduce((result, c) => matchCondition(message, c), true);
}

function matchCondition(message, condition){
    let value = message[condition.field];
    if(value == undefined) return false;

    let re = new RegExp(condition.value);
    switch(condition.operator){
        case "equals":
            return value == condition.value;
        case "contains":
            return value.includes(condition.value);
        case "regex":
            // expect the value to be in string format without slashes
            return re.test(value);
        default: 
            return false
    }
}

function matchedQueries(message, allQueries){ // returns [ queryIds ]
    return Object.values(allQueries)
        .filter((q) => match(message, q))
        .map((q) => q.id);
}

function enumerateSessionQueries (queryIds, repository) { //returns [ { sid, qid }]

    return queryIds.reduce((result, qid) => {
        let sids =  repository.getSids(qid);
        let pairs = sids.map((sid) => { return { sid: sid, qid: qid} });
        return result.concat(pairs);
    }, []);
}

function reduceSessionQueriesBySid (sessionQueryPairs) {  // returns [ { sid, [ queryIds ]} ]
    let sessionMap = sessionQueryPairs.reduce( (result, p) => {
        result[p.sid] = result[p.sid] || { sid: p.sid, queryIds : [] };
        result[p.sid].queryIds.push(p.qid);
        return result;
    }, {});
    return Object.values(sessionMap);
}

function convertSessionQueriesToConnectionQueries(reducedSessionQueries, repository){ // returns [ { connection, [ queryIds ] } ]
    return reducedSessionQueries.map((x) => Object.assign({ connection: repository.getConnection(x.sid) }, x));
}

export class Resolver{
    constructor(repository){
        this.repository = repository;        
    }

    resolveTargets(message){    // returns [ { connection, queryIds }]
        return convertSessionQueriesToConnectionQueries(
            reduceSessionQueriesBySid(
                enumerateSessionQueries(
                    matchedQueries(message, this.repository.getAllQueries()), this.repository
                )
            ), this.repository
        ).filter((x) => x.connection != undefined);
    }
}
