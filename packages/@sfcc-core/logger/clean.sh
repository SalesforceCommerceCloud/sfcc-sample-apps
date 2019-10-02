#!/usr/bin/env bash

if [ -f ./sfcc-*.tgz ]; then
    rm ./sfcc-*.tgz
    echo "Ok. Removed archive file."
else
    echo "Ok. No archive exists."
fi

if [ -f ./index.js ]; then
    rm ./index.js
    echo "Ok. Removed index file."
else
    echo "Ok. No index exists."
fi

if [ -f ./index.js ]; then
    rm ./index.js
    echo "Ok. Removed index file."
else
    echo "Ok. No index exists."
fi
