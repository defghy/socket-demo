import Router from 'koa-router';
import axios from 'axios';
import auth from '../middlewaves/auth';

const router = new Router();

const {
  LVMI_APPID,
  LVMI_APPKEY,
  LVMI_HOST
} = process.env;

router.get('/demo', auth, async (ctx) => {
  // demo
  ctx.render('demo');
});

router.get('/demo/data', async (ctx) => {
  const data = {
    devices: [
      {
        name: '开关',
        did: 'lumi.158d00014aadd8',
        attributes: ['ctrl_ch0_status']
      },
      {
        name: '无线开关',
        did: 'lumi.158d00010b555d',
        attributes: ['switch_status']
      },
      {
        name: '插座',
        did: 'lumi.158d00011c860f',
        attributes: ['plug_status']
      },
      {
        name: '温湿度',
        did: 'lumi.158d00016c8d4e',
        attributes: ['humidity_value', 'temperature_value']
      }
    ]
  };

  const allAxios = data.devices.map((d) => {
    const url = `${LVMI_HOST}/open/res/query/option`;
    const { openId, access_token } = JSON.parse(ctx.cookies.get('auth'));
    const payload = { openId, did: d.did, option: d.attributes };
    const headers = {
      Appid: LVMI_APPID,
      Appkey: LVMI_APPKEY,
      Openid: openId,
      'Access-Token': access_token
    };
    return axios.post(url, payload, { headers });
  });

  await axios.all(allAxios).then(axios.spread((...result) => {
    result.forEach((res, index) => {
      data.devices[index].attributes = res.data.result.data;
    });
  }));

  ctx.body = data;
});

router.post('/demo/control/:did', auth, async (ctx) => {
  const url = `${LVMI_HOST}/open/res/control`;
  const { openId, access_token } = JSON.parse(ctx.cookies.get('auth'));
  const { did } = ctx.params;
  const payload = { openId, did, data: ctx.request.body };
  const headers = {
    Appid: LVMI_APPID,
    Appkey: LVMI_APPKEY,
    Openid: openId,
    'Access-Token': access_token
  };
  await axios.post(url, payload, { headers }).then((res) => {
    ctx.body = res.data;
  }, (error) => {
    console.log(error);
  });
});

export default router;
