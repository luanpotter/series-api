const serverless = require('serverless-http');
const express = require('express');

const { routes } = require('./src/app');

const app = express();
routes(app);

module.exports.handler = serverless(app);
