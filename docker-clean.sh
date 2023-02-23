#!/bin/bash

# Stop and remove all running containers
sudo docker stop $(sudo docker ps -aq)
sudo docker rm $(sudo docker ps -aq)

# Remove all volumes
sudo docker volume rm $(sudo docker volume ls -q)

# Remove all networks
sudo docker network rm $(sudo docker network ls -q)

# Remove all images
sudo docker rmi $(sudo docker images -a -q)

# Prune unused Docker objects
sudo docker system prune -af