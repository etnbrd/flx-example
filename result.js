var flx = require('flx');
var app = require('express')(), fs = require('fs'), count = 0;
app.get('/', function placeholder() {
  return flx.start(flx.m('handler-1000', {
    _args: arguments,
    _sign: {}
  }));
});
if (!module.parent) {
  app.listen(8080);
  console.log('>> listening 8080');
}

// reply-1001 -> null

flx.register('reply-1001', function capsule(msg) {
  if (msg._update) {
    for (var i in msg._update) {
      this[i] = msg._update[i];
    }
  } else {
    fs.readFile(__filename, function reply(error, data) {
      this.count += 1;
      msg._sign.res.send('this file was downloaded ' + this.count + ' times\n\n' + data);
    }.bind(this));
  }
}, { count: count });

// handler-1000
// -> reply-1001 [res(signature), count(scope)]

flx.register('handler-1000', function capsule(msg) {
  if (msg._update) {
    for (var i in msg._update) {
      this[i] = msg._update[i];
    }
  } else {
    (function handler(req, res) {
      flx.post(flx.m('reply-1001', {
        _args: arguments,
        _sign: { res: res }
      }));
    }.apply(this, msg._args));
  }
}, { fs: fs });