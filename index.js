const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

const { routes } = require('./src/app');

const app = express();
app.use(cors());
routes(app);

module.exports.handler = serverless(app);
