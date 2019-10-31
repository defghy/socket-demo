import Router from 'koa-router';
import axios from 'axios';
import qs from 'qs';

const router = new Router();
const { LVMI_APPID, LVMI_APPKEY } = process.env;

router.get('/access_token', async (ctx) => {
  const url = 'https://aiot-oauth2.aqara.cn/access_token';
  const { code } = ctx.query;
  await axios.post(url, qs.stringify({
    grant_type: 'authorization_code',
    client_id: LVMI_APPID,
    client_secret: LVMI_APPKEY,
    code,
    redirect_uri: 'https://touch.qunar.com/'
  })).then((res) => {
    res.data.created_at = Date.now();
    ctx.cookies.set('auth', JSON.stringify(res.data));
    ctx.redirect('/demo');
  }, (error) => {
    console.log('===', error);
  });
});

export default router;
