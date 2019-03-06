#!/bin/bash

#echo Build and Publish all
cd sfcc
lerna bootstrap --hoist
npm run pub
cd ../sfra
lerna bootstrap --hoist
npm run pub

cd ..

