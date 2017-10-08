test('validQueryConditions handles regex', () => {
    let conditions = [{
        field: "tweet",
        operator: "contains",
        value: "/a/"
    }];

    let sut = new AppLogic()
    let result = sut.validQueryConditions(conditions);

    expect(result).toBeTruthy();
})

test('validQueryConditions returns false if invalid field', () => {
    let conditions = [{
        field: "xtweet",
        operator: "contains",
        value: "/a/"
    }];

    let sut = new AppLogic()
    let result = sut.validQueryConditions(conditions);

    expect(result).toBeFalsy();
})

test('validQueryConditions returns false if invalid operator', () => {
    let conditions = [{
        field: "tweet",
        operator: "xcontains",
        value: "/a/"
    }];

    let sut = new AppLogic()
    let result = sut.validQueryConditions(conditions);

    expect(result).toBeFalsy();
})

test('validQueryConditions returns false if missing field', () => {
    let conditions = [{
        operator: "contains",
        value: "/a/"
    }];

    let sut = new AppLogic()
    let result = sut.validQueryConditions(conditions);

    expect(result).toBeFalsy();
})

test('validQueryConditions returns false if missing value', () => {
    let conditions = [{
        field: "tweet",
        operator: "contains"
    }];

    let sut = new AppLogic()
    let result = sut.validQueryConditions(conditions);

    expect(result).toBeFalsy();
})

test('validQueryConditions returns false if missing operator', () => {
    let conditions = [{
        field: "tweet",
        value: "/a/"
    }];

    let sut = new AppLogic()
    let result = sut.validQueryConditions(conditions);

    expect(result).toBeFalsy();
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

    let sut = new AppLogic()
    let result = sut.validQueryConditions(conditions);

    expect(result).toBeFalsy();
})