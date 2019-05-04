# series-api

A AWS Lambda serverless express REST API to process, store and retrieve data from series from IMDB.

## Setup

Run `npm install` on root folder.

Be sure to download and install AWS CLI in order to configure your credentials file. That will allow the program to access the S3 bucket and also to deploy the function to Lambda.

To setup the S3 bucket, just run the `setup.js` file with node, or run:

```bash
./cmds/setup.sh
```

This will scrap IMDB and populate the bucket with the required files.

After that, you can run locally (but accessing S3):

```bash
./cmds/start.sh
```

To deploy, run the deploy script:

```bash
./cmds/deploy.sh
```

## API Spec

The API specification can be seen on [this file](./APIS.md).