const serverless = require('serverless-http');
const express = require('express');

const { query } = require('./parser');
const { write } = require('./storage.js');

const app = express();

app.get('/', (_, res) => {
    const data = 'Hello, and welcome to the Series API!';
    res.status(200).send(data);
});

app.get('/admin/query', (req, resp) => {
    const data = { title: req.query.title, season: req.query.season };
    query(data).then(result => resp.status(200).send(JSON.stringify(result.data)));
});

app.get('/admin/_addSeries', async (req, resp) => {
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

app.get('/admin/addSerie', async (req, resp) => {
    const title = req.query.title;
    const season = req.query.season;

    console.log(`Running for title: ${title}, season: ${season}`);
    const { data } = await query({ title, season });

    const url = `series/${title}/seasons/${season}`;
    const ps = [
        write(`${url}`, { id: season }),
        write(`${url}/episodes`, data),
    ];
    ps.push(...data.map((episode) => write(`${url}/episodes/${episode.id}`, episode)));

    console.log('Dispatched. Waiting...');
    Promise.all(ps).then(() => {
        console.log('Done!');
        resp.status(200).send('Ok, will do.');
    }).catch(ex => {
        console.error('Error!', ex);
        resp.status(500).send(JSON.stringify(ex));
    });
});

app.get('/admin/seasons', (_, res) => {
    const data = 'Hello, and welcome to the Series API!';
    res.status(200).send(data);
});

module.exports.handler = serverless(app);