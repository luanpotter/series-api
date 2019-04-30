#!/bin/bash -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

api_url=`cat ./prod_api_url`
echo "Deploying with $api_url"

API_URL=$api_url npm run deploy
