import td from 'testdouble'
import Repository from './repository.js'
import { match, Resolver } from './resolver.js'


test('match equals query returns true', () => {
    let query = {
        field: "tweet", 
        operator: "equals",
        value: "Hello"
    }

    let message = {
        tweet: "Hello"
    }

    expect(match(message, query)).toBeTruthy();
});

test('match equals query returns false', () => {
    let query = {
        field: "tweet", 
        operator: "equals",
        value: "Hello"
    }

    let message = {
        tweet: "Good bye"
    }

    expect(match(message, query)).toBeFalsy();
});

test('match contains query returns true', () => {
    let query = {
        field: "tweet", 
        operator: "contains",
        value: "world"
    }

    let message = {
        tweet: "Hello, world"
    }

    expect(match(message, query)).toBeTruthy();
});

test('match contains query returns false', () => {
    let query = {
        field: "tweet", 
        operator: "contains",
        value: "Hello"
    }

    let message = {
        tweet: "Good bye"
    }

    expect(match(message, query)).toBeFalsy();
});

test('match regex query returns true', () => {
    let query = {
        field: "tweet", 
        operator: "regex",
        value: ".*"
    }

    let message = {
        tweet: "Hello, world"
    }

    expect(match(message, query)).toBeTruthy();
});

test('match regex query returns false', () => {
    let query = {
        field: "tweet", 
        operator: "regex",
        value: "Hello"
    }

    let message = {
        tweet: "Good bye"
    }

    expect(match(message, query)).toBeFalsy();
});

test('match invalid field returns false', () => {
    let query = {
        field: "nonexistantField", 
        operator: "equals",
        value: "Hello"
    }

    let message = {
        tweet: "Good bye"
    }

    expect(match(message, query)).toBeFalsy();
});

test('match invalid operator returns false', () => {
    let query = {
        field: "tweet", 
        operator: "badOperator",
        value: "Hello"
    }

    let message = {
        tweet: "Good bye"
    }

    expect(match(message, query)).toBeFalsy();
});

test('example query match', () => {
    let query = [
        {
            field: "tweet", 
            operator: "contains", 
            value: "daredevil"
        }
    ]
    let message = {
        "tweet": "daredevil awesome. #greatshow",
        "user": "user-10",
        "retweet_count": 75,
        "created_at": 1470424244752,
        "verified": false,
        "lang": "en"
    }

    expect(match(message, query)).toBeTruthy();
    
})

test('example compound query match', () => {
    let query = [
        {
            field: "tweet", 
            operator: "regex", 
            value: "narcos|cuervos"
        },
        {
            field: "lang", 
            operator: "equals", 
            value: "es"
        }
    ]
    let message = {
        "tweet": "narcos rocks. #greatshow",
        "user": "user-13",
        "retweet_count": 449,
        "created_at": 1470424244752,
        "verified": false,
        "lang": "es"
    }

    expect(match(message, query)).toBeTruthy();
    
})

test('resolveTargets finds one query and one connection', () => {
    let testQueries = [
        {
            id: 'Q1',
            conditions: [
                {
                    field: 'tweet',
                    operator: 'equals',
                    value: 'M1'
                }
            ]
        }   
    ]
    let message = { tweet: 'M1'};
    let mockRepository = td.constructor(Repository);
    td.when(mockRepository.prototype.getAllQueries()).thenReturn(testQueries);
    td.when(mockRepository.prototype.getSids('Q1')).thenReturn(['S1']);
    td.when(mockRepository.prototype.getConnection('S1')).thenReturn('C1');

    let sut = new Resolver(new mockRepository());
    var targets = sut.resolveTargets(message);
    
    expect(targets.length).toEqual(1);
    expect(targets[0]).toMatchObject({ connection: 'C1', queryIds: ['Q1']});
});

test('resolveTargets finds multiple queries and one connection', () => {
    let testQueries = [
        {
            id: 'Q1',
            conditions: [
                {
                    field: 'tweet',
                    operator: 'equals',
                    value: 'M1'
                }
            ]
        } ,
        {
            id: 'Q2',
            conditions: [
                {
                    field: 'tweet',
                    operator: 'contains',
                    value: 'M'
                }
            ]
        }   
    ]
    let message = { tweet: 'M1'};
    let mockRepository = td.constructor(Repository);
    td.when(mockRepository.prototype.getAllQueries()).thenReturn(testQueries);
    td.when(mockRepository.prototype.getSids('Q1')).thenReturn(['S1']);
    td.when(mockRepository.prototype.getSids('Q2')).thenReturn(['S1']);
    td.when(mockRepository.prototype.getConnection('S1')).thenReturn('C1');

    let sut = new Resolver(new mockRepository());
    var targets = sut.resolveTargets(message);
    
    expect(targets.length).toEqual(1);
    expect(targets[0]).toMatchObject({ connection: 'C1', queryIds: ['Q1', 'Q2']});
});

test('resolveTargets finds one query and multiple connections', () => {
    let testQueries = [
        {
            id: 'Q1',
            conditions: [
                {
                    field: 'tweet',
                    operator: 'equals',
                    value: 'M1'
                }
            ]
        }   
    ]
    let message = { tweet: 'M1'};
    let mockRepository = td.constructor(Repository);
    td.when(mockRepository.prototype.getAllQueries()).thenReturn(testQueries);
    td.when(mockRepository.prototype.getSids('Q1')).thenReturn(['S1', 'S2']);
    td.when(mockRepository.prototype.getConnection('S1')).thenReturn('C1');
    td.when(mockRepository.prototype.getConnection('S2')).thenReturn('C2');

    let sut = new Resolver(new mockRepository());
    var targets = sut.resolveTargets(message);
    
    expect(targets.length).toEqual(2);
    expect(targets[0]).toMatchObject({ connection: 'C1', queryIds: ['Q1']});
    expect(targets[1]).toMatchObject({ connection: 'C2', queryIds: ['Q1']});

});

test('resolveTargets finds multiple queries and multiple connection', () => {
    let testQueries = [
        {
            id: 'Q1',
            conditions: [
                {
                    field: 'tweet',
                    operator: 'equals',
                    value: 'M1'
                }
            ]
        } ,
        {
            id: 'Q2',
            conditions: [
                {
                    field: 'tweet',
                    operator: 'contains',
                    value: 'M'
                }
            ]
        }   
    ]
    let message = { tweet: 'M1'};
    let mockRepository = td.constructor(Repository);
    td.when(mockRepository.prototype.getAllQueries()).thenReturn(testQueries);
    td.when(mockRepository.prototype.getSids('Q1')).thenReturn(['S1']);
    td.when(mockRepository.prototype.getSids('Q2')).thenReturn(['S1', 'S2']);
    td.when(mockRepository.prototype.getConnection('S1')).thenReturn('C1');
    td.when(mockRepository.prototype.getConnection('S2')).thenReturn('C2');

    let sut = new Resolver(new mockRepository());
    var targets = sut.resolveTargets(message);
    
    expect(targets.length).toEqual(2);
    expect(targets[0]).toMatchObject({ connection: 'C1', queryIds: ['Q1', 'Q2']});
    expect(targets[1]).toMatchObject({ connection: 'C2', queryIds: ['Q2']});
});