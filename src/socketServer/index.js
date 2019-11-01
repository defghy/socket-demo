const socketio = require('socket.io');

const start = function({app, server}) {

  const ws = socketio(server, {
    path: '/push',
    pingInterval: 30000
  });
  global.pushServer = ws;

  ws.set('origins', 'http://dev.kf.test.yunshanmeicai.com:8079');
  ws.on('connection', (socket) => {

    const hotelid = socket.hotelid || '';
    const roomlist = socket.roomlist || [];

    socket.on('event', (data) => {
      console.log('event: ', data);
    });
    socket.on('disconnect', () => {
      console.log('web socket disconnect');
    });
  });

};

module.exports = start;
