#!/usr/bin/env bash

pnpm nx sync &> /tmp/nxsync.log

git diff --exit-code &> /tmp/nxsync.diff

if [ $? -ne 0 ]; then
  echo "NxSyncError: The workspace is out of sync. Please run 'pnpm nx sync', commit your changes, and try again." >&2
  echo "--------------------------------------------------" >&2
  echo "Nx log:" >&2
  cat /tmp/nxsync.log >&2
  echo "--------------------------------------------------" >&2
  echo "See the diff below for details:" >&2
  cat /tmp/nxsync.diff >&2
  exit 1
fi

rm /tmp/nxsync.log
rm /tmp/nxsync.diff
