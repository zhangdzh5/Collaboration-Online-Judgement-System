# Collaboration-Online-Judgement-System

The Collaboration Online Judgement System is a web applications designed for collaborative users to write and run codes. 

The frontend is developed using Angular, incoorprated with WebSocket and Ace editor to provide coding environments for collaborative users. 

Backend service is build on Node.js, assited by Docker which helps compile and run submitted codes. MongoDB and Reddis is used for data storage and collaboration.

### Test on local
A simple laucher file is provided.
```bash
./laucher.sh
```
Or, to test each end
```bash
cd ./coj-server
sudo npm install
nodemon server.js
```
```bash
cd ../coj-client
sudo npm install
ng build --watch
```
```bash
cd ../executor
pip install -r requirements.txt
python executor_server.py
```
