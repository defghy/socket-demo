module.exports = async (ctx, next) => {
  let { userId, platform } = ctx.query || {};
  platform = platform || '/kf';
  if (userId) {
    global.push.of(platform).to([userId]).emit('message', `用户${userId}收消息`);
  } else {
    global.push.of(platform).emit('message', {
      data: '全体用户收到消息'
    });
  }

  ctx.body = {
    ret: 1,
    data: `消息发送成功`
  };
  await next();
}
