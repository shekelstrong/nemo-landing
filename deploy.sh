#!/bin/bash
set -e
echo "=== Deploying nemo-landing ==="
cd /opt/nemo-landing
git pull origin main
docker build -t nemo-landing .
docker stop nemo-landing 2>/dev/null || true
docker rm nemo-landing 2>/dev/null || true
docker run -d --name nemo-landing --restart unless-stopped -p 3000:3000 nemo-landing
echo "=== nemo-landing deployed ==="
