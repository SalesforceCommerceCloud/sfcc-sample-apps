#!/bin/bash

#echo Build and Publish all
cd sfra-app
yarn
yarn build
yarn start:commerce

