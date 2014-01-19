module.exports = function(app, models) {
  app.get('/api/trees', function(req, res) {

    var count, filter, exclude; 

    if (req.query) {
      if (req.query.count) {
        count = parseInt(req.query.count);
      }
      filter = req.query.filter;
      if (req.query.exclude) {
        exclude = req.query.exclude == 'me' ?
                  req.session.accountId :
                  req.query.exclude;
      }
    }

    models.Tree.findByIds(undefined, filter, count, exclude, function(trees) {
      res.send(trees);
    });
  });

  app.get('/api/trees/:id', function(req, res) {
    models.Tree.findById(req.params.id, function(tree) {
      res.send(tree);
    });
  });

  app.post('/api/trees', function(req, res) {
    var accountId = req.session.accountId;

    var name = req.param('name');
    var description = req.param('description');

   // Missing name, don't bother going any further
    if (null === name) {
      res.send(400);
      return;
    }

    models.Account.findById(accountId, function(account) {
      if ( account ) {
        models.Tree.createTree(name, description, account.pseudo, accountId, function(err, tree) {
          if (err) {
            return console.log('Error creating tree: ' + err);
          }
          models.Account.addTree(account, tree, false);
          models.Account.createActivity(account, 'TreeCreated', tree.name, tree._id, null, null, function(/*err*/) {
            res.send(200);
          });
        });
      }
    });
  });

  app.put('/api/trees/:id', function(req, res) {
    var accountId = req.session.accountId;
    var treeId = req.param('id', null);    

    if (null === treeId) {
      res.send(400);
      return;
    }  

    var update = req.body;
    update.updateDate = new Date();
    console.log(JSON.stringify(update));

    models.Account.findById(accountId, function(account) {
      models.Tree.findById(treeId, function(tree) {
        models.Tree.updateTree(tree._id, {$set: update}, function(/*err*/) {
          models.Account.createActivity(account, 'TreeUpdated', tree.name, tree._id, null, null, function(/*err*/) {
            res.send(200);
          });
        });
      });
    });
  });

  app.delete('/api/trees/:id', function(req, res) {
    var accountId = req.session.accountId;
    var treeId = req.param('id', null);     
  
    if (null === treeId) {
      res.send(400);
      return;
    }  
 
    models.Account.findById(accountId, function(account) {
      if ( !account ) return;
 
      models.Tree.findById(treeId, function(tree) {
        if ( !tree ) return;

        models.Account.removeTree(account, treeId);
        models.Tree.deleteTree(treeId);
        models.Account.createActivity(account, 'TreeDeleted', tree.name, treeId);
      });
    });
 
    // Note: Not in callback - this endpoint returns immediately and
    // processes in the background
    res.send(200);
  });

  app.post('/api/trees/find', function(/*req, res*/) {
/*
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
*/
  });
};