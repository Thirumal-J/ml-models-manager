sudo docker compose down &&
sudo docker images prune -a && 
sudo docker volume prune && 
sudo docker network prune && 
sudo docker container prune &&
sudo docker compose rm --all && 
sudo docker rmi -f $(sudo docker images -a -q)
