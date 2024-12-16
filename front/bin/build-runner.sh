#!/bin/sh

dist_dir='./server-dist'

for path in \
    run.js \
    utils
do
    arg='--out-file'

    if [ -d "./${path}" ]; then
        arg='--out-dir'
    fi

    ./node_modules/.bin/swc "./${path}" "${arg}" "${dist_dir}/${path}" || exit 1
done
