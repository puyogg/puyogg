#!/usr/bin/env bash
shopt -s globstar

# cp .env.example .env

for i in services/*/.env.example; do
    OUT_FILE=$(echo $i | sed -e 's/.env.example/.env/')
    cp $i $OUT_FILE
done
