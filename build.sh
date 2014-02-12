#!/bin/sh
# Uses wintersmith to generate static files

rm -r ./build
wintersmith build
