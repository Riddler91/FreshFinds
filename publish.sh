#!/bin/bash
set -e
echo "🔨 Building FreshFinds..."
cd /work/freshfinds

# Ensure prebuilt binary for better-sqlite3 is in place
if [ ! -f node_modules/better-sqlite3/build/Release/better_sqlite3.node ]; then
  mkdir -p node_modules/better-sqlite3/build/Release
  cp node_modules/better-sqlite3/prebuilds/linux-x64.node node_modules/better-sqlite3/build/Release/better_sqlite3.node
fi

bun run build
echo "🌱 Seeding database..."
npx tsx scripts/seed.ts 2>/dev/null || echo "⚠️  Seed skipped (may already exist)"
echo "🚀 Starting production server on port 3000..."
sudo sh -c 'lsof -t -iTCP:3000 -sTCP:LISTEN | xargs -r kill' 2>/dev/null || true
nohup bun run start > /work/freshfinds/server.log 2>&1 &
sleep 2
echo "✅ FreshFinds is live on port 3000"
