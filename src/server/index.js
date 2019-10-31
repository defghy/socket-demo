const Koa = require('koa');
const path = require('path');
const http = require('http');
const bodyParser = require('koa-bodyparser');

const routers = require('./routers.js');

const { PORT } = process.env;
const app = new Koa();
app.on('error', error => {
  console.error(error);
})
process.on('uncaughtException', function(error) {
  console.error(error);
});

// 中间件
app.use(bodyParser());
app.use(routers.routes()).use(routers.allowedMethods());


// 启动监听
const server = http.createServer(app.callback());
server.listen(PORT);
server.on('listening', () => {
  console.log(`api服务启动: ${PORT}`);
})
