#!/usr/bin/env sh

mkdir -p tmp

wget https://www.unicode.org/Public/UCD/latest/ucd/emoji/emoji-data.txt -O tmp/emoji-data.txt

FULL_VERSION=`head -n1 tmp/emoji-data.txt | grep -E -o "[0-9]+\.[0-9]+\.[0-9]+"`
EMOJI_VERSION=`head -n1 tmp/emoji-data.txt | grep -E -o "[0-9]+\.[0-9]+"`

rm -rf tmp

npm version $FULL_VERSION --no-git-tag-version
EMOJI_VERSION=$EMOJI_VERSION node ./scripts/build.js
