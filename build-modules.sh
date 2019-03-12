#!/bin/bash

#echo Build and Publish all
cd sfcc
lerna bootstrap --hoist
npm run build
cd ../sfra
lerna bootstrap --hoist
npm run build

cd ..

