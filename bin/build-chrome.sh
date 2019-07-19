#!/usr/bin/env bash

echo "Building Ecosia Navigator for Chrome"
yarn build --production
echo "Creating package..."
dist_dir="build/ecosia-navigator"
zip -FSj "${dist_dir}-chrome.zip" ${dist_dir}/*

echo "Build complete"
