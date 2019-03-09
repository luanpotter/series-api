const serverless = require('serverless-http');
const express = require('express');

const app = express();

app.get('/hello', (req, res) => {
    const data = `Hello, ${req.path}`;
    res.status(200).send(data);
});

module.exports.handler = serverless(app);