const serverless = require('serverless-http');
const express = require('express');

const { adminRoutes } = require('./src/admin');
const { mainRoutes } = require('./src/main');

const app = express();

mainRoutes(app);
adminRoutes(app);

module.exports.handler = serverless(app);
