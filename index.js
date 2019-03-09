const serverless = require('serverless-http');
const express = require('express');

const app = express();

const { query } = require('./parser');

app.get('/', (_, res) => {
    const data = 'Hello, and welcome to the Series API!';
    res.status(200).send(data);
});

app.get('/query', (req, resp) => {
    const data = { title: req.query.title, season: req.query.season };
    query(data).then(result => resp.status(200).send(JSON.stringify(result.data)));
});

app.get('/_addSeries', async (req, resp) => {
    const title = req.query.title;
    const { seasons, data } = await query({ title, season: '1' });
    const numberSeasons = seasons.map(i => parseInt(i)).reduce((a, b) => a > b ? a : b);
    const allSeasons = { '1': data };
    for (let i = 2; i <= numberSeasons; i++) {
        const season = `${i}`;
        const { data } = await query({ title, season });
        allSeasons[season] = data;
    }
    resp.status(200).send(JSON.stringify(allSeasons));
});

app.get('/seasons', (_, res) => {
    const data = 'Hello, and welcome to the Series API!';
    res.status(200).send(data);
});

module.exports.handler = serverless(app);