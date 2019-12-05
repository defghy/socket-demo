const socketio = require('socket.io');
const redisAdapter = require('./redisAdapter');

const start = function({app, server}) {

  const ws = socketio(server, {
    path: '/push',
    pingInterval: 30000
  });
  global.push = ws;

  // adapter
  ws.adapter(redisAdapter);


  // 设置跨域cors
  ws.origins((origin, callback) => {
    if (!origin.includes('local')) {
      return callback('origin not allowed', false);
    }
    callback(null, true);
  });

  // 区分平台
  const platforms = ['kf'];
  platforms.forEach(pname => {
    const plat = ws.of('/' + pname);
    plat.on('connection', (socket) => {

      const { id } = socket;
      const { userId } = socket.handshake.query;

      // 分组socket
      socket.join(userId);

      socket.on('event', (data) => {
        console.log('event: ', data);
      });
      socket.on('disconnect', () => {
        console.log('web socket disconnect');
      });
    });
  });

};

module.exports = start;
