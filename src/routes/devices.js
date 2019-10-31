import Router from 'koa-router';
import axios from 'axios';
import auth from '../middlewaves/auth';

const router = new Router();
const {
  LVMI_APPID,
  LVMI_APPKEY,
  LVMI_HOST
} = process.env;

router.get('/devices', auth, async (ctx) => {
  const url = `${LVMI_HOST}/open/device/query/user`;
  const { openId, access_token } = JSON.parse(ctx.cookies.get('auth'));
  const payload = { openId };
  const headers = {
    Appid: LVMI_APPID,
    Appkey: LVMI_APPKEY,
    Openid: openId,
    'Access-Token': access_token
  };
  await axios.post(url, payload, { headers }).then((res) => {
    // ctx.body = res.data;
    ctx.render('devices/list', res.data);
  }, (error) => {
    console.log(error);
  });
});

router.get('/devices/:did', auth, async (ctx) => {
  const url = `${LVMI_HOST}/open/res/query`;
  const { openId, access_token } = JSON.parse(ctx.cookies.get('auth'));
  const { did } = ctx.params;
  const payload = { openId, did };
  const headers = {
    Appid: LVMI_APPID,
    Appkey: LVMI_APPKEY,
    Openid: openId,
    'Access-Token': access_token
  };
  await axios.post(url, payload, { headers }).then((res) => {
    // ctx.body = res.data;
    ctx.render('devices/attributes', res.data);
  }, (error) => {
    console.log(error);
  });
});

router.get('/devices/:did/attributes/:attribute', auth, async (ctx) => {
  const url = `${LVMI_HOST}/open/res/query/option`;
  const { openId, access_token } = JSON.parse(ctx.cookies.get('auth'));
  const { did, attribute } = ctx.params;
  const option = attribute.split(',');
  const payload = { openId, did, option };
  const headers = {
    Appid: LVMI_APPID,
    Appkey: LVMI_APPKEY,
    Openid: openId,
    'Access-Token': access_token
  };
  await axios.post(url, payload, { headers }).then((res) => {
    // ctx.body = res.data;
    ctx.render('devices/attribute', res.data);
  }, (error) => {
    console.log(error);
  });
});

router.all('/push/attributes', async (ctx) => {
  console.log('--/push/attributes: ', ctx.request.body);
  global.socket.emit('msg', ctx.request.body);
  ctx.body = {
    code: 0
  };
});

export default router;
