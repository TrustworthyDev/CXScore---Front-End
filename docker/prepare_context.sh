#!/bin/bash
mkdir -p main-ui/src
cp -rf ../src/* main-ui/src/
cp ../package.json main-ui/
cp ../*config* main-ui/
cp ../index.html main-ui/
cp ../yarn.lock main-ui/
cp ../.env.production main-ui/


