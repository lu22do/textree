var restify = require('restify');
var client = restify.createJsonClient({
  version: '*',
  url: 'http://127.0.0.1:8080'
});

describe('rest api test1', function() {

  describe('authentication check', function() {
    it('should get a 401 response', function(done) {
      client.get('/api/account/authenticated', function(err, req, res, data) {
        if (err && res.statusCode == 401) {
          done();
        } else {
          throw new Error('invalid response: ' + res.statusCode);
        }
      });
    });
  });

  describe('login without inputs check', function() {
    it('should get a 400 error', function(done) {
      client.post('/api/login', function(err, req, res, data) {
        if (err && res.statusCode == 400) {
          done();
        } else {
          throw new Error('invalid response: ' + res.statusCode);
        }
      });
    });
  });

});