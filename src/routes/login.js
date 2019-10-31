import Router from 'koa-router';
import axios from 'axios';

const router = new Router();
const { LVMI_HOST, LVMI_APPID, LVMI_APPKEY, LVMI_ACCOUNT, LVMI_PASSWD } = process.env;

router.get('/login', async (ctx) => {
  const url = `https://aiot-oauth2.aqara.cn/authorize?client_id=${LVMI_APPID}&response_type=code&redirect_uri=http://${ctx.header.host}/access_token`;
  ctx.redirect(url);
});



// 自动登录
import qs from 'querystring';
router.get('/login2', async (ctx) => {
  await openLoginPage(ctx);
  await doLogin(ctx);
  await fetchAccessTokenByCode(ctx);
});

var cookieObj2Str = function(cookieObj) {
    if(!cookieObj) {
        return "";
    }
    return Object.keys(cookieObj).map(function(name) {
                    return `${name}=${cookieObj[name]};`;
                }).join(" ");
};
var setCookieArr2Obj = function(setCookies) {
    var cookies = {};

    (setCookies || []).forEach(function(ck) {
        var item = ck.split(";")[0] || "";
        item = item.split("=");
        var name = (item[0] || "").trim(),
            value = (item[1] || "").trim();
        cookies[name] = value;
    });

    return cookies;
};

function openLoginPage(ctx) {
  var params = {
    client_id: LVMI_APPID,
    response_type: "code",
    redirect_uri: ctx.header.host
  };
  const url = `https://aiot-oauth2.aqara.cn/authorize?${qs.stringify(params)}`;
  const payload = { client_id: LVMI_APPID, client_secret: LVMI_APPKEY, grant_type: "refresh_token" };
  return axios({
    url: url,
    method: "get",
    headers: {
      "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Encoding":"gzip, deflate, sdch",
      "Accept-Language":"zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4,ja;q=0.2",
      "Cache-Control":"no-cache",
      "Connection":"keep-alive",
      "Host":"aiot-oauth2.aqara.cn",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
    }
  }).then((res) => {
    var setCookies = res.headers && res.headers["set-cookie"];
    if(setCookies && setCookies.length) {
      ctx.cookie = cookieObj2Str(setCookieArr2Obj(setCookies));
    }
  }).catch((error) => {
    console.log(error);
  });
}

function doLogin(ctx) {
  var params = {
    client_id: LVMI_APPID,
    response_type: "code",
    redirect_uri: ctx.header.host
  };
  const url = `https://aiot-oauth2.aqara.cn/authorize?${qs.stringify(params)}`;
  var data = qs.stringify({ 
    account: LVMI_ACCOUNT,
    password: LVMI_PASSWD
  });
  return axios({
    url: url,
    method: "post",
    data: data,
    headers: {
      "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Encoding":"gzip, deflate, sdch",
      "Accept-Language":"zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4,ja;q=0.2",
      "Cache-Control":"no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": ctx.cookie,
      "Connection":"keep-alive",
      "Host":"aiot-oauth2.aqara.cn",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
    },
    maxRedirects: 0, // 不跳转
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 400;
    }
  }).then((res) => {
    var loc = res.headers.location;
    if(loc) {
      ctx.authcode = loc.match(/code=(\w+)$/)[1];
    }
  }).catch((error) => {
    console.log(error);
  });
}

function fetchAccessTokenByCode(ctx) {

    const url = 'https://aiot-oauth2.aqara.cn/access_token';
    return axios.post(url, qs.stringify({
      grant_type: 'authorization_code',
      client_id: LVMI_APPID,
      client_secret: LVMI_APPKEY,
      code: ctx.authcode,
      redirect_uri: 'https://touch.qunar.com/'
    })).then((res) => {
      var data = res.data;
      data = {
        access_token: data.access_token,
        openId: data.openId,
        refresh_token: data.refresh_token,
        update_time: new Date().getTime()
      };
    }, (error) => {
      console.log('===', error);
    });

}

function freshToken(ctx) {

  const url = 'https://aiot-oauth2.aqara.cn/refresh_token';
  return axios.post(url, qs.stringify({
    grant_type: 'refresh_toke',
    client_id: LVMI_APPID,
    client_secret: LVMI_APPKEY,
    code: ctx.authcode,
    refresh_token: ctx.refreshToken
  })).then((res) => {
    var data = res.data;
    data = {
      access_token: data.access_token,
      openId: data.openId,
      refresh_token: data.refresh_token,
      update_time: new Date().getTime()
    };
  }, (error) => {
    console.log('===', error);
  });

}


export default router;
