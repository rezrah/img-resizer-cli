#!/bin/bash

tsc

echo "#!/usr/bin/env node" | cat - dist/index.js > temp && mv temp dist/index.js

if [[ -n "$(command -v chmod)" ]]; then
  chmod +x dist/index.js
else
  chmod u+x dist/index.js # For Unix/Linux
fi
