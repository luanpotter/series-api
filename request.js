const fetch = require('node-fetch');
const { API_URL } = require('./env');
const esc = encodeURIComponent;

const request = (url, params) => fetch(buildUrl(API_URL + url, params));

const buildUrl = (url, params) => url + '?' + Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');

module.exports = { esc, request, buildUrl };