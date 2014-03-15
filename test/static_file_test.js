var restify = require('restify');
var client = restify.createJsonClient({
  version: '*',
  url: 'http://127.0.0.1:8080'
});

describe('static file test', function() {

  describe('200 response check', function() {
    it('should get a 200 response', function(done) {
      client.get('/', function(err, req, res, data) {
        if (err) {
          throw new Error(err);
        } else {
          if (res.statusCode != 200) {
            throw new Error('invalid response from /: ' + res.statusCode);
          }
          done();
        }
      });
    });
  });

  describe('404 response check', function() {
    it('should get a not found (404) response', function(done) {
      client.get('/index.html', function(err, req, res, data) {
        if (err && res.statusCode == 404) {
          done();
        } else {
          throw new Error('invalid response from /index.html: ' + res.statusCode);
        }
      });
    });
  });

});