const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const bucket = 'series-api-files';

const read = file => {
    return s3.getObject({ Bucket: bucket, Key: file }).promise();
};

const write = (file, content) => {
    return s3.putObject({ Bucket: bucket, Key: file, Content: content }).promise();
};

module.exports = { bucket, read, write };