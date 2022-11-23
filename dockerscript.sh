# sudo docker rmi -f $(sudo docker images -a -q) && 
sudo docker compose down &&
sudo docker images prune -a && 
sudo docker volume prune && 
sudo docker container prune &&
sudo docker compose rm --all && 
sudo docker compose pull && 
sudo docker compose build --build-arg CACHEBUST=$(date +%s) && 
sudo docker compose up --force-recreate