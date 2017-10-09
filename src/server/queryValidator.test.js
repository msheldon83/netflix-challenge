import validQueryConditions from './queryValidator.js'
test('validQueryConditions handles regex', () => {
    let conditions = [{
        field: "tweet",
        operator: "regex",
        value: "/a/"
    }];

    let result = validQueryConditions(conditions);

    expect(result.length).toEqual(0);
})

test('validQueryConditions errors on invalid regex', () => {
    let conditions = [{
        field: "tweet",
        operator: "regex",
        value: "/*/"
    }];

    let result = validQueryConditions(conditions);
    expect(result.length).toEqual(1);
})

test('validQueryConditions returns false if invalid field', () => {
    let conditions = [{
        field: "xtweet",
        operator: "contains",
        value: "/a/"
    }];

    let result = validQueryConditions(conditions);

    expect(result.length).toEqual(1);
})

test('validQueryConditions returns false if invalid operator', () => {
    let conditions = [{
        field: "tweet",
        operator: "xcontains",
        value: "/a/"
    }];

    let result = validQueryConditions(conditions);

    expect(result.length).toEqual(1);
})

test('validQueryConditions returns false if missing field', () => {
    let conditions = [{
        operator: "contains",
        value: "/a/"
    }];

    let result = validQueryConditions(conditions);

    expect(result.length).toEqual(1);
})

test('validQueryConditions returns false if missing value', () => {
    let conditions = [{
        field: "tweet",
        operator: "contains"
    }];

    let result = validQueryConditions(conditions);

    expect(result.length).toEqual(1);
})

test('validQueryConditions returns false if missing operator', () => {
    let conditions = [{
        field: "tweet",
        value: "/a/"
    }];

    let result = validQueryConditions(conditions);

    expect(result.length).toEqual(1);
})

test('validQueryConditions returns false if one invalid', () => {
    let conditions = [{
            field: "tweet",
            operator: "contains",
            value: "/a/"
        },
        {
            field: "xtweet",
            operator: "contains",
            value: "/a/"
        }
    ];

    let result = validQueryConditions(conditions);
    expect(result.length).toEqual(1);
})