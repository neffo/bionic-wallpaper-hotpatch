#!/bin/bash

FILENAME=bionichotpatch@neffo.github.com

rm $FILENAME
zip -r $FILENAME *
zip -d $FILENAME buildzip.sh
