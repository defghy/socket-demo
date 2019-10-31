module.exports = async (ctx, next) => {
  global.pushServer.sockets.emit('全局消息', {
    data: '测试数据'
  });
  ctx.body = {
    ret: 1,
    data: `消息发送成功`
  };
  await next();
}
