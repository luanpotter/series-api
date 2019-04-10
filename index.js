const serverless = require('serverless-http');
const express = require('express');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const app = express();

const { query } = require('./parser');

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

    console.log(`Running for ${{ title, season }}`);
    const { data } = await query({ title, season });

    writeS3(`series/${title}/seasons/${season}`, { id: season });
    writeS3(`series/${title}/seasons/${season}/episodes`, data);

    data.forEach((episode) => writeS3(`series/${title}/seasons/${season}/episodes/${episode.id}`, episode));

    console.log('Dispatched.');
    resp.status(200).send('Ok, will do.');
});

app.get('/admin/seasons', (_, res) => {
    const data = 'Hello, and welcome to the Series API!';
    res.status(200).send(data);
});

const writeS3 = (filename, content) => {
    var bucketName = 'series-api';
    var params = { Bucket: bucketName, Key: filename, Body: content };

    return s3.putObject(params);
}

module.exports.handler = serverless(app);