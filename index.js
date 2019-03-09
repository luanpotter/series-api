const serverless = require('serverless-http');
const express = require('express');

const app = express();

const { query } = require('./parser');

app.get('/hello', (req, res) => {
    const data = `Hello, ${req.path}`;
    res.status(200).send(data);
});

app.get('/query', (req, resp) => {
    const data = { title: req.query.title, season: req.query.season };
    query(data).then(result => resp.status(200).send(JSON.stringify(result)));
});

module.exports.handler = serverless(app);