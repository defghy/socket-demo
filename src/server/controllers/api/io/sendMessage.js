module.exports = async (ctx, next) => {
  global.pushServer && global.pushServer.sockets.emit('gl_msg', {
    data: '测试数据'
  });
  ctx.body = {
    ret: 1,
    data: `消息发送成功`
  };
  await next();
}
