import Repository from './repository.js'

test('added query returned in getAllQueries', () => {
    let sut = new Repository();
    let query = { field: "message", operator: "equals", value: "hello" };
    let sid = '123';

    let queryId = sut.addQuery(query, sid);
    let foundQuery = sut.getAllQueries().find( q => q.id === queryId);

    expect(foundQuery).toBeDefined();
    expect(foundQuery.conditions[0]).toMatchObject(query);
});

test('added query returned in getQueries', () => {
    let sut = new Repository();
    let query = { field: "message", operator: "equals", value: "hello" };
    let sid = '123';

    let queryId = sut.addQuery(query, sid);
    let foundQuery = sut.getQueries(sid).find( q => q.id === queryId);

    expect(foundQuery).toBeDefined();
    expect(foundQuery.conditions[0]).toMatchObject(query);
});

test('added query is idempotent', () => {
    let sut = new Repository();
    let query = { field: "message", operator: "equals", value: "hello" };
    let sid = '123';

    let queryId = sut.addQuery(query, sid);
    let queryId2 = sut.addQuery(query, sid);
    let foundQuery = sut.getQueries(sid).filter( q => q.id === queryId);
    let foundSids = sut.getSids(queryId)

    expect(queryId).toEqual(queryId2);
    expect(foundQuery.length).toEqual(1);
    expect(foundSids.length).toEqual(1);
});

test('added query different condition order is still idempotent', () => {
    let sut = new Repository();
    let condition1 = { field: "message", operator: "equals", value: "hello" };
    let condition2 = { field: "message", operator: "contains", value: "world" };
    let sid = '123';

    let queryId = sut.addQuery([condition1, condition2], sid);
    let queryId2 = sut.addQuery([condition2, condition1], sid);
    let foundQuery = sut.getQueries(sid).filter( q => q.id === queryId);
    let foundSids = sut.getSids(queryId)

    expect(queryId).toEqual(queryId2);
    expect(foundQuery.length).toEqual(1);
    expect(foundSids.length).toEqual(1);
});

test('added query added to multiple sids returns all sids', () => {
    let sut = new Repository();
    let query = { field: "message", operator: "equals", value: "hello" };
    let sid = '123';
    let sid2 = '345';

    let queryId = sut.addQuery(query, sid);
    let queryId2 = sut.addQuery(query, sid2);
    let resultSids = sut.getSids(queryId);

    expect(queryId).toEqual(queryId2);
    expect(resultSids).toContain(sid);
    expect(resultSids).toContain(sid2);
});

test('removed query not returned in getAllQueries', () => {
    let sut = new Repository();
    let query = { field: "message", operator: "equals", value: "hello" };
    let sid = '123';

    let queryId = sut.addQuery(query, sid);
    let removedQuery = sut.removeQuery(query, sid);
    let foundQuery = sut.getAllQueries().find(q => q.id === queryId);

    expect(removedQuery.id).toEqual(queryId);
    expect(foundQuery).toBeUndefined();
});

test('removed query not returned in getQueries', () => {
    let sut = new Repository();
    let query = { field: "message", operator: "equals", value: "hello" };
    let sid = '123';

    let queryId = sut.addQuery(query, sid);
    let removedQuery = sut.removeQuery(query, sid);
    // console.log(sut.getQueries(sid))
    let foundQuery = (sut.getQueries(sid) || []).find( q => q.id === queryId);

    expect(foundQuery).toBeUndefined();
    expect(removedQuery.conditions[0]).toMatchObject(query);
});

test('removed query does not include sid in list', () => {
    let sut = new Repository();
    let query = { field: "message", operator: "equals", value: "hello" };
    let sid = '123';
    let sid2 = '345';

    let queryId = sut.addQuery(query, sid);
    let queryId2 = sut.addQuery(query, sid2);   // eslint-disable-line no-unused-vars
    let removedQuery = sut.removeQuery(query, sid);
    let resultSids = sut.getSids(queryId);
    let found = resultSids.find(x => x == sid );

    expect(found).toBeUndefined();
    expect(removedQuery.conditions[0]).toMatchObject(query);
});

test('addConnection creates can be retrieved', () => {
    let sut = new Repository();
    let sid = '123';
    let fakeConnection = "connection";
    
    let conn = sut.addConnection(fakeConnection, sid);
    let retrievedConnection = sut.getConnection(sid);
    expect(conn).toBeDefined();
    expect(conn).toEqual(retrievedConnection);

});

test('removeConnection returns existing connection if there is one', () => {
    let sut = new Repository();
    let sid = '123';
    let fakeConnection = "connection";

    let conn = sut.addConnection(fakeConnection, sid);
    let removedConn = sut.removeConnection(sid);
    let retrievedConnection = sut.getConnection(sid);
    expect(conn).toEqual(removedConn);
    expect(retrievedConnection).toBeUndefined();

});

test('getQueries for non existant sid returns empty array', () => {
    let sut = new Repository();
    let sid = '123';

    let result = sut.getQueries(sid);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toEqual(0);

});

test('getSids for non existant qid returns empty array', () => {
    let sut = new Repository();
    let qid = '123';

    let result = sut.getSids(qid);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toEqual(0);

});