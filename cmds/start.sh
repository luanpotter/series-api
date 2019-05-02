#!/bin/bash -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

api_url=http://localhost:3000
query_secret=123

API_URL=$api_url QUERY_SECRET=$query_secret npm run start
