class App{
    constructor(repository, fireHose){
        this.repository = repository; 
        this.fireHose = fireHose;
    }

    addConnection(conn, sid){
        return repository.addConnection(conn, sid);
    }

    getQueries(sid){
        return repository.getQueries(sid);
    }

    addQuery(query, sid){
        let response = repository.addQuery(query.sid);
        // TODO start firehose

        return response;
    }

    removeQueryById(qid, sid){
        let response = repository.removeQueryById(qid, sid);
        // TODO stop firehose???
        
        return response;
    }


}

export default App;