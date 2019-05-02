# series-api

A AWS Lambda serverless express REST API to process, store and retrieve data from series from IMDB.

## Setup

Run `npm install` on root folder. To run locally, use the start script:

```bash
./cmds/start.sh
```

To deploy, first create a file called `cmds/config.properties` with two properties: the url for the deployed API and the query param secret key for the admin bit. Something like this:

```bash
api_url=http://localhost:3000
query_secret=123
```

Currently there is a link to an encrypted file on my dot-keys folder, you can replace that to run for yourself.

Then, run only deploy script (configure your aws cli properly):

```bash
./cmds/deploy.sh
```
