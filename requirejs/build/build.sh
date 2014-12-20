#!/bin/sh

MYDIR=$(dirname "$0")
bash "$MYDIR/../bin/x" "$MYDIR/build.js" "$@"
