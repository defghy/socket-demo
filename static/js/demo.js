function did(id, attr) {
  return id.replace('.', '-') + '-' + attr;
}

var t1;
var socket = io();
socket.on('connect', function() {
  console.log('socket connected');
});
socket.on('msg', function(res) {
  console.log('msg data: ', res);
  if (res.msgType === 'resource') {
    res.data.forEach(function(item) {
      var value = parseInt(item.value, 10).toString();
      $('#' + did(item.did, item.attr)).data('value', value).html(item.attr + ' = ' + value + '(' + item.time + ')' + '(' + (new Date() - t1) + ')');
    });
  }
});
socket.on('disconnect', function() {
  console.log('socket disconnect.');
});

$(document).ready(function() {
  $.getJSON('/demo/data', function(data) {
    var html = [];
    data.devices.forEach(function(d) {
      html.push('<li>');
      html.push('<span>' + d.name + '</span>');
      html.push('<ul>');
      for (key in d.attributes) {
        if (d.attributes.hasOwnProperty(key)) {
          html.push('<li id="' + did(d.did, key) + '" data-did="' + d.did + '" data-attr="' + key + '" data-value="' + d.attributes[key] + '">' + key + ' = ' + d.attributes[key] + '</li>');
        }
      }
      html.push('</ul>');
      html.push('</li>');
    });
    $(html.join('')).appendTo('#devices');
  });

  $('#devices').on('click', 'ul li', function() {
    t1 = new Date();
    var url = '/demo/control/' + $(this).data('did');
    var data = {};
    data[$(this).data('attr')] = $(this).data('value').toString() === '0' ? '1' : '0';
    $.post(url, data, function(res) {
      console.log(res);
      if (res.code === 0) {
        console.log('控制请求发送成功');
      } else if (res.code === 402) {
        alert('登录已过期，请重新登录');
        location.href = '/login';
      } else {
        alert('控制请求发送失败，未知原因:' + res.code);
      }
    });
  });
});
