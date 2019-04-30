# series-api

A AWS Lambda serverless express REST API to process, store and retrieve data from series from IMDB.

## Setup

Run `npm install` on root folder. To run locally, use the start script:

```bash
./cmds/start.sh
```

To deploy, first create a file called `cmds/prod_api_url` with the url for the deployed URL.

Then, run only deploy script (configure your aws cli properly):

```bash
./cmds/deploy.sh
```
