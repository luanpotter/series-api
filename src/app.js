const moment = require('moment');
const { read } = require('./storage');

const { isObject, isArray, DATE_FORMAT } = require('./utils');

const mockDatesObj = (data, diff) => {
    return Object.keys(data).reduce((result, key) => {
        if (key === 'releaseDate') {
            const actual = moment(data[key], DATE_FORMAT);
            const mocked = actual.add(diff, 'days');
            result[key] = mocked.format(DATE_FORMAT);
        } else {
            result[key] = mockDates(data[key]);
        }
        return result;
    }, {});
};

const mockDates = (data, diff) => {
    if (!diff) {
        return data;
    }
    if (isArray(data)) {
        return data.map(e => mockDates(e, diff));
    } else if (isObject(data)) {
        return mockDatesObj(data, diff);
    } else {
        return data;
    }
};

const routes = app => {
    app.get('/', (_, res) => {
        const data = `Hello, and welcome to the Series API! Specs: https://github.com/luanpotter/series-api/blob/master/APIS.md`;
        res.status(200).send(data);
    });

    app.get(/^\/series(\/.*)?$/, async (req, res) => {
        try {
            const mockDate = req.query.mockDate;
            const url = req.path.replace(/^\//g, '');
            console.log(`Requesting ${url}`);

            const data = JSON.parse(await read(url));
            console.log(`Received ${JSON.stringify(data)}`);

            const diff = mockDate ? moment().diff(moment(mockDate, DATE_FORMAT), 'days') : null;
            diff && console.log(`Mocking with diff: ${diff}`);
            const enhanced = mockDates(data, diff);
            console.log(`Responding ${JSON.stringify(enhanced)}`);

            res.status(200).type('json').send(JSON.stringify(enhanced));
        } catch (ex) {
            console.error('Could not found file', ex);
            res.status(404).send('Not found');
        }
    });
};

module.exports = { routes };

