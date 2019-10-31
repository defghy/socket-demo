import http from 'http';
import socketio from 'socket.io';
import { Qails } from 'qails';
import fixLvmiHeaders from './middlewaves/fix-lvmi-headers';

const { PORT } = process.env;

const app = new Qails({
  middlewaves: [
    'static',
    'cors',
    'session',
    fixLvmiHeaders,
    'body',
    'json',
    'pug',
    'routes'
  ]
});

const server = http.createServer(app.koa.callback());
const ws = socketio(server);

console.log(`socketio starting ${new Date().toLocaleString()}`);

ws.on('connection', (socket) => {
  global.socket = socket;
  console.log('web socket connected');
  socket.emit('heartbeat', Date.now());
  socket.on('event', (data) => {
    console.log('event: ', data);
  });
  socket.on('disconnect', () => {
    console.log('web socket disconnect');
  });
});

server.listen(PORT, (err) => {
  if (err) {
    throw err;
  }

  console.log(`✅ qails listening on port ${PORT}`);
});
