function match(message, query){  // returns bool

}

function matchedQueries(message, allQueries){ // returns [ queryIds ]

}

function enumerateSessionQueries (queryIds, sessionQueryMap) { //returns [ { sid, queryid }]

}

function reduceSessionQueriesBySid (sessionQueries) {  // returns [ { sid, [ queryIds ]} ]

}

function resolveSidConnection(sid){ // returns connection

}

function convertSessionQueriesToConnectionQueries(reducedSessionQueries){ // returns [ { connection, [ queryIds ] } ]

}

class Resolver{
    constructor(repository){
        this.repository = repository;        
    }

    resolveTargets(message){

    }
}

export default Resolver;