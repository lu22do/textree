module.exports = function(app, models) {
  app.get('/api/*', function(req, res, next) {
    if (req.session.loggedIn) {
      next();
    } else {
      res.send(401);
    }
  });

  app.get('/api/accounts/:id', function(req, res) {
    var accountId = req.params.id == 'me' ?
                    req.session.accountId :
                    req.params.id;
    models.Account.findById(accountId, function(account) {
      res.send(account);
    });
  });

  app.get('/api/accounts/:id/activities', function(req, res) {
    var accountId = req.params.id == 'me' ?
                    req.session.accountId :
                    req.params.id;
    models.Account.findById(accountId, function(account) {
      res.send(account.activities);
    });
  });

  app.get('/api/accounts/:id/contacts', function(req, res) {
    var accountId = req.params.id == 'me' ?
                    req.session.accountId :
                    req.params.id;
    models.Account.findById(accountId, function(account) {
      res.send(account.contacts);
    });
  });

  app.get('/api/accounts/:id/trees', function(req, res) {
    var accountId = req.params.id == 'me' ?
                    req.session.accountId :
                    req.params.id;
    models.Account.findById(accountId, function(account) {
      var treelist = account.trees;
      if (account.admin) {
        treelist = undefined; 
      }
      models.Tree.findByIds(treelist, function(trees) {
        res.send(trees)
      });
    });

  });

  app.post('/api/accounts/:id/contact', function(req, res) {
    var accountId = req.params.id == 'me' ?
                    req.session.accountId :
                    req.params.id;

    var contactId = req.param('contactId');

   // Missing contactId, don't bother going any further
    if ( null == contactId ) {
      res.send(400);
      return;
    }

    models.Account.findById(accountId, function(account) {
      if ( account ) {
        models.Account.findById(contactId, function(contact) {
          models.Account.addContact(account, contact);

          // Make the reverse link
          models.Account.addContact(contact, account);
          account.save();
        });
      }
    });

    // Note: Not in callback - this endpoint returns immediately and
    // processes in the background
    res.send(200);
  });

  app.delete('/api/accounts/:id/contact', function(req,res) {
    var accountId = req.params.id == 'me' ?
                    req.session.accountId :
                    req.params.id;
    var contactId = req.param('contactId', null);     
  
    // Missing contactId, don't bother going any further
    if ( null == contactId ) {
      res.send(400);
      return;
    }  
 
    models.Account.findById(accountId, function(account) {
      if ( !account ) return;
      models.Account.findById(contactId, function(contact,err) {
        if ( !contact ) return;  
 
        models.Account.removeContact(account, contactId);
        // Kill the reverse link
        models.Account.removeContact(contact, accountId);
      });
    });
 
    // Note: Not in callback - this endpoint returns immediately and
    // processes in the background
    res.send(200);
  });

  app.post('/api/contacts/find', function(req, res) {
    var searchStr = req.param('searchStr');
    if (null == searchStr) {
      res.send(400);
      return;
    }

    models.Account.findByString(searchStr, function onSearchDone(err, accounts) {
      if (err || accounts.length == 0) {
        res.send(404);
      } else {
        res.send(accounts);
      }
    });
  });
};