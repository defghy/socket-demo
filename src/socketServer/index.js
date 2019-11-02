const socketio = require('socket.io');

const start = function({app, server}) {

  const ws = socketio(server, {
    path: '/push',
    pingInterval: 30000
  });
  global.pushServer = ws;

  ws.origins((origin, callback) => {
    if (!origin.includes('yunshanmeicai.com')) {
      return callback('origin not allowed', false);
    }
    callback(null, true);
  });
  ws.on('connection', (socket) => {

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

};

module.exports = start;
