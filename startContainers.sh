sudo docker compose build --build-arg CACHEBUST=$(date +%s) && 
sudo docker compose up --force-recreate
# sudo docker compose build --no-cache && 
# sudo docker compose up