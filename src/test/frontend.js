import io from 'socket.io-client';

const userId = Math.random() > 0.5? 1: 2;
const platform = 'kf';
var socket = io(`http://localhost:8713/${platform}`, {
  path: '/push',
  query: {
    userId
  }
});
console.log(`使用用户${userId}`);

socket.on('message', function(data){
  console.log(`接收到信息： ${JSON.stringify(data)}`);
});