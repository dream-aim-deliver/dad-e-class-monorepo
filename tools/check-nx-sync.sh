#!/usr/bin/env bash

pnpm nx sync &> /dev/null

git diff --exit-code &> /dev/null

if [ $? -ne 0 ]; then
  echo "NxSyncError: The workspace is out of sync. Please run 'pnpm nx sync', commit your changes, and try again." >&2
  exit 1
fi

