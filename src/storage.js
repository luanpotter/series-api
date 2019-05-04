const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const bucket = 'series-api';

const read = file => {
    const params = { Bucket: bucket, Key: file };
    return s3.getObject(params).promise().then(e => e.Body.toString('UTF-8'));
};

const write = (file, content) => {
    const params = { Bucket: bucket, Key: file, Body: JSON.stringify(content) };
    return s3.putObject(params).promise();
};

module.exports = { bucket, read, write };