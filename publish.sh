#!/bin/bash
set -e
echo "🔨 Building FreshFinds..."
cd /work/freshfinds
bun run build
echo "🚀 Starting production server on port 3000..."
sudo sh -c 'lsof -t -iTCP:3000 -sTCP:LISTEN | xargs -r kill' 2>/dev/null || true
nohup bun run start > /work/freshfinds/server.log 2>&1 &
sleep 2
echo "✅ FreshFinds is live on port 3000"
