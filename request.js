const fetch = require('node-fetch');
const { API_URL, QUERY_SECRET } = require('./env');

const esc = encodeURIComponent;
const secret = QUERY_SECRET;

const request = (url, params) => fetch(buildUrl(API_URL + url, { secret, ...params }));

const buildUrl = (url, params) => url + '?' + Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');

module.exports = { esc, request, buildUrl };
