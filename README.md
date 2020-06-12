# ip-cam
Enter the same room id will enter the same room.

### to use

##### setting server
```
// for the nginx setting
// https://gist.github.com/bradtraversy/cd90d1ed3c462fe3bddd11bf8953a896
sudo apt install nodejs
sudo apt install nginx
npm install -g yarn
npm install -g parcel-bundler
```

##### build client
```
cd ./client
yarn build
```
##### start server
```
cd ./server
pm2 start index.js --name ip-cam
```

##### url
https://jiangby.xyz/ip-cam

### run local
#### build server
```
cd ./server
npm install
```
#### build client
```
cd ./client
yarn build
```
#### run server
```
cd ./server
node index.js
```
#### run client
```
cd ./client
yarn start
```
