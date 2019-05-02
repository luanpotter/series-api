#!/bin/bash -e

function prop {
    grep '^\s*'"$1"'=' config.properties | cut -d '=' -f2
}

cd "$( dirname "${BASH_SOURCE[0]}" )"

api_url=`prop api_url`
query_secret=`prop query_secret`

echo "Deploying with api_url = $api_url and query_secret = $query_secret"

API_URL=$api_url QUERY_SECRET=$query_secret npm run deploy
