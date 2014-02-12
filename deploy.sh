#!/bin/sh
# Syncs static files with the walesmd.github.io repository

rsync -rtvu ./build/ ../walesmd.github.io/

cd ../walesmd.github.io
git add -A
git commit -am "Commit on $(date)"
git push
