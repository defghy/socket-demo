module.exports = async (ctx, next) => {
  ctx.body = {
    ret: 1,
    data: `消息发送成功`
  };
  await next();
}
