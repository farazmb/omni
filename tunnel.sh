#!/bin/bash
while true; do
  echo "[$(date)] Starting tunnel..."
  ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=10 -o ServerAliveCountMax=3 -R 80:localhost:3000 nokey@localhost.run
  echo "[$(date)] Tunnel disconnected, reconnecting in 2 seconds..."
  sleep 2
done
