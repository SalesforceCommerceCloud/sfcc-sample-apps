#!/bin/bash

#echo Build and Publish all
cd sfcc
lerna bootstrap --hoist

# CORE
cd packages/core
npm run clean
npm run pub

# LOGGER
cd ../logger
npm run clean
npm run pub

# APICONFIG
cd ../apiconfig
npm run clean
npm run pub

# CORE-GRAPHQL
cd ../core-graphql
npm run clean
npm run pub

# SFRA
cd ../../../sfra
lerna bootstrap --hoist

# PRODUCTAPI
cd packages/productapi
npm run clean
npm run pub

# CONTENTAPI
cd ../contentapi
npm run clean
npm run pub

# CUSTOMERAPI
cd ../customerapi
npm run clean
npm run pub


cd ../../../

