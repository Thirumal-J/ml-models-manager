# sudo docker compose build --build-arg CACHEBUST=$(date +%s) && 
# sudo docker compose up --force-recreate -d

#!/bin/bash

# stop and remove all running containers
sudo docker compose down

# remove all stopped containers, networks, and volumes
sudo docker system prune -af

# build all Docker images without cache
sudo docker compose build --no-cache

# start all containers in the background
sudo docker compose up -d
