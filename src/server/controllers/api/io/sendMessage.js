module.exports = async (ctx, next) => {
  if (ctx.query.userId) {
    global.pushServer.to([ctx.query.userId]).emit('message', `用户${ctx.query.userId}收消息`);
  } else {
    global.pushServer && global.pushServer.sockets.emit('message', {
      data: '全体用户收到消息'
    });
  }

  ctx.body = {
    ret: 1,
    data: `消息发送成功`
  };
  await next();
}
