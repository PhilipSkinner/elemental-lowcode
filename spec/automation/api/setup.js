const systemHelpers = require('../helpers/systemHelpers');

before(() => {
    return systemHelpers.init();
});

after(() => {
    return systemHelpers.terminate();
});