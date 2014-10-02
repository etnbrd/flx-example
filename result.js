var flx = require('flx');
var app = require('express')(), fs = require('fs'), count = 0;
app.get('/', function placeholder() {
  return flx.start(flx.m('handler-1000', {
    _args: arguments,
    _sign: {}
  }));
});
app.listen(8080);
console.log('>> listening 8080');

// handler-1000
// -> reply-1001 [res(signature), count(scope)]

flx.register('handler-1000', function capsule(msg) {
  (function handler(req, res) {
    flx.post(flx.m('reply-1001', {
      _args: arguments,
      _sign: { res: res }
    }));
  }.apply(this, msg._args));
}, { fs: fs });

// reply-1001 -> null

flx.register('reply-1001', function capsule(msg) {
  fs.readFile(__filename, function reply(err, data) {
    this.count += 1;
    var code = ('' + data).replace(/\n/g, '<br>').replace(/ /g, '&nbsp');
    msg._sign.res.send(err || 'downloaded ' + this.count + ' times<br><br><code>' + code + '</code>');
  }.bind(this));
}, { count: count });