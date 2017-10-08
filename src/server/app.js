function validCondition(c){
    const validFields = ["tweet", "language", "user"];
    const validOperators = ["equals", "contains", "regex"];

    if(c.field === undefined || !validFields.includes(c.field)) return false;
    if(c.operator === undefined || !validOperators.includes(c.operator)) return false;
    if(c.value === undefined) return false;

    return true;
}


// This class is primarily a proxy, but handles negotiation between the repository and firehose
class App{
    constructor(repository, fireHose){
        this.repository = repository; 
        this.fireHose = fireHose;
    }

    validQueryConditions(queryConditions){
        let conditions = Array.isArray(queryConditions) ? queryConditions : [queryConditions];
        return conditions.every((c) => { return validCondition(c)})
    }

    addConnection(conn, sid){
        return this.repository.addConnection(conn, sid);
    }

    getQueries(sid){
        return this.repository.getQueries(sid);
    }

    addQuery(query, sid){

        let response = this.repository.addQuery(query, sid);
        this.fireHose.start();
        return response;
    }

    removeQueryById(qid, sid){
        let response = this.repository.removeQueryById(qid, sid);
        if(this.repository.getAllQueries().length == 0)
            this.fireHose.stop();

        return response;
    }


}

export default App;