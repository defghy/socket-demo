# Socket Demo

1. 使用 `websocket` 替代 `polling`，后者握手时使用多个http请求很难打到同一个worker上面(https://github.com/Unitech/pm2/issues/1510);
2. 不同的用户连接到不同的socket server进程，如何同时给不同socket server推送消息，暂用redis;

## install
1. 安装redis(https://www.cnblogs.com/taojietaoge/p/11010704.html)
2. npm install

## dev

```
npm run dev

// demo html:
http://localhost:8713/demo.html

// push api:
curl http://localhost:8713/api/io/sendMessage?userId=1&platform=kf // user 1
curl http://localhost:8713/api/io/sendMessage?userId=2&platform=kf // user 2
curl http://localhost:8713/api/io/sendMessage?platform=kf  // all kf
```

## dev pm2
```
1. 启动redis(redis-server)
2. npm run start
其他同dev
```
