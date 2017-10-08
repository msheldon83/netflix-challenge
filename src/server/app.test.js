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

