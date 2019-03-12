#!/bin/bash

#echo Build and Start App
cd app
yarn
yarn clean
yarn build
yarn start:commerce
