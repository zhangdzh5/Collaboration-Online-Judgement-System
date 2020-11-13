#!/bin/bash
fuser -k 3000/tcp
fuser -k 5000/tcp

cd ./coj-server
sudo npm install
nodemon server.js &

cd ../coj-client
sudo npm install
ng build --watch &

cd ../executor
pip install -r requirements.txt
python executor_server.py &

echo "================================================"
read -p "PRESS [ENTER] TO TERMINATE PROCESS." PRESSKEY

fuser -k 3000/tcp
fuser -k 5000/tcp