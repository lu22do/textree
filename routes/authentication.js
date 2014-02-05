module.exports = function(app, models) {
  app.get('/api/account/authenticated', function(req, res) {
    if (req.session.loggedIn) {
      models.Account.findById(req.session.accountId, function(account) {
        res.send(account);
      });
    } else {
      res.send(401);
    }
  });

  app.post('/api/forgotpassword', function(req, res) {
    var hostname = req.headers.host;
    var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
    var email = req.param('email', null);
    if (null === email || email.length < 1) {
      res.send(400);
      return;
    }

    models.Account.forgotPassword(email, resetPasswordUrl, function(success){
      if (success) {
        res.send(200);
      } else {
        // Username or password not found
        res.send(404);
      }
    });
  });

  app.get('/api/resetPassword', function(req, res) {
    var accountId = req.param('account', null);
    res.render('resetPassword.jade', {locals:{accountId:accountId}});
  });

  app.post('/resetPassword', function(req, res) {
    var accountId = req.param('accountId', null);
    var password = req.param('password', null);
    if (null !== accountId && null !== password) {
      models.Account.changePassword(accountId, password);
    }
    res.render('resetPasswordSuccess.jade');
  });

  app.post('/api/login', function(req, res) {
    console.log('login request');
    var email = req.param('email', null);
    var password = req.param('password', null);

    if (null === email || email.length < 1 || null === password || password.length < 1) {
      res.send(400);
      return;
    }

    models.Account.login(email, password, function(account) {
      if (!account) {
        res.send(401);
        return;
      }
      console.log('login was successful');
      req.session.loggedIn = true;
      req.session.accountId = account._id;
      res.send(account);
    });
  });

  app.post('/api/logout', function(req, res) {
    req.session.destroy(function(err){
      if (err) {
        console.log('logout: could not destroy the session');
      } else {
        console.log('logout: successful');
      }
      res.send(200);
    });
  });

  app.post('/api/register', function(req, res) {
    var firstName = req.param('firstName', '');
    var lastName = req.param('lastName', '');
    var pseudo = req.param('pseudo', null);
    var email = req.param('email', null);
    var password = req.param('password', null);

    if (null === email || email.length < 1 || 
        null === password || password.length < 1 || 
        null === pseudo || pseudo.length < 1) {
      res.send(400);
      return;
    }

    models.Account.register(email, password, pseudo, firstName, lastName);
    res.send(200);
  });
};