#!/bin/bash

echo "Clear Verdaccio Cache"
rm -rf ~/.local/share/verdaccio/storage/*

cd packages/core
rm ./sfra*.tgz
npm install
npm run pub

cd ../wishlist
rm ./sfra*.tgz
npm install
npm run pub

cd ../logger
rm ./sfra*.tgz
npm install
npm run pub

cd ../fakepayment
rm ./sfra*.tgz
npm install
npm run pub

cd ../..

