import td from 'testdouble'
import Repository from './repository.js'
import FireHose from './fireHose.js'
import AppLogic from './app.js'

test('adding a query turns on the firehose', () => {
    let mockRepository = td.constructor(Repository);

    let mockFireHose = td.constructor(FireHose);
    let fireHose = new mockFireHose();
    td.function('.start');

    let sut = new AppLogic(new mockRepository(), fireHose)

    sut.addQuery("Q1", "S1");
    td.verify(fireHose.start());
});

test('removing last query turns off firehose', () => {
    let mockRepository = td.constructor(Repository);
    td.when(mockRepository.prototype.getAllQueries()).thenReturn([]);

    let mockFireHose = td.constructor(FireHose);
    let fireHose = new mockFireHose();
    td.function('.stop');

    let sut = new AppLogic(new mockRepository(), fireHose)

    sut.removeQueryById("Q1", "S1");
    td.verify(fireHose.stop());
        
});

test ('validQueryConditions handles regex', () => {
    let conditions = [{
        field: "tweet",
        operator: "contains",
        value: "/a/"
    }];

    let sut = new AppLogic()
    let result = sut.validQueryConditions(conditions);

    expect(result).toBeTruthy();
})

test ('validQueryConditions returns false if invalid field', () => {
    let conditions = [{
        field: "xtweet",
        operator: "contains",
        value: "/a/"
    }];

    let sut = new AppLogic()
    let result = sut.validQueryConditions(conditions);

    expect(result).toBeFalsy();
})

test ('validQueryConditions returns false if invalid operator', () => {
    let conditions = [{
        field: "tweet",
        operator: "xcontains",
        value: "/a/"
    }];

    let sut = new AppLogic()
    let result = sut.validQueryConditions(conditions);

    expect(result).toBeFalsy();
})

test ('validQueryConditions returns false if missing field', () => {
    let conditions = [{
        operator: "contains",
        value: "/a/"
    }];

    let sut = new AppLogic()
    let result = sut.validQueryConditions(conditions);

    expect(result).toBeFalsy();
})

test ('validQueryConditions returns false if missing value', () => {
    let conditions = [{
        field: "tweet",
        operator: "contains"
    }];

    let sut = new AppLogic()
    let result = sut.validQueryConditions(conditions);

    expect(result).toBeFalsy();
})

test ('validQueryConditions returns false if missing operator', () => {
    let conditions = [{
        field: "tweet",
        value: "/a/"
    }];

    let sut = new AppLogic()
    let result = sut.validQueryConditions(conditions);

    expect(result).toBeFalsy();
})

test ('validQueryConditions returns false if one invalid', () => {
    let conditions = [{
        field: "tweet",
        operator: "contains",
        value: "/a/"
    },
    {
        field: "xtweet",
        operator: "contains",
        value: "/a/"
    }];

    let sut = new AppLogic()
    let result = sut.validQueryConditions(conditions);

    expect(result).toBeFalsy();
})