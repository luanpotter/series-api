const serverless = require('serverless-http');
const express = require('express');

const { adminRoutes } = require('./admin');
const { read } = require('./storage');

const { API_URL } = require('./env');

const app = express();

adminRoutes(app);

app.get('/', (_, res) => {
    const data = `Hello, and welcome to the Series API! My URL: ${API_URL}`;
    res.status(200).send(data);
});

app.get(/^\/series(\/.*)?$/, async (req, res) => {
    try {
        const url = req.url.replace(/^\//g, '');
        console.log(`Requesting ${url}`);
        const data = await read(url);
        console.log(`Responding ${data}`);
        res.status(200).type('json').send(data);
    } catch (ex) {
        console.error('Could not found file', ex);
        res.status(404).send('Not found');
    }
});

module.exports.handler = serverless(app);
