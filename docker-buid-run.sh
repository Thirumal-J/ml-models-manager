sudo docker compose build --build-arg CACHEBUST=$(date +%s) && 
sudo docker compose up --force-recreate -d