
module.exports = function(app, models) {
  app.get('/api/branches/:id', function(req, res) {
    models.Tree.findBranch(req.params.id, function(branch) {
      res.send(branch);
    });
  });

  app.get('/api/branches/:id/detailed', function(req, res) {
    models.Tree.findBranch(req.params.id, function(branch) {
      var len = branch.children.length;
      if (0 === len) {
        res.send(branch);
      } 
      else {
        models.Tree.findBranches(branch.children, function(childBranches) {
          branch.children = childBranches;
          res.send(branch);
        });
      }
    });
  });

  app.post('/api/branches', function(req, res) {
    var accountId = req.session.accountId;

    var parentId = req.param('parentId'); // parent branch to attach new branch to
    var title = req.param('title');
    var text = req.param('text');

    if (null === parentId) {
      res.send(400);
      return;
    }

    models.Account.findById(accountId, function(account) {
      if (account) {
        models.Tree.findBranch(parentId, function(parentBranch) {
          models.Tree.findById(parentBranch.tree, function(tree) {
            models.Tree.createBranch(parentId, title, text, account.pseudo, accountId, function(err, branch) {
              if (err) {
                console.log('Error creating branch: ' + err);
                res.send(404);
              }
              else  {
                models.Tree.updateTree(tree._id, {$set: {updateDate: new Date()}, $inc: {nbBranches: 1}}, function(err) {
                  if (err) {
                    console.log('updateTree error:' + err);
                  }
                  models.Account.createActivity(account, 'BranchCreated', branch.title, branch._id, tree.name, tree._id, function(/*err*/) {
                    res.send(200);
                  });
                });
              }
            });
          });
        });        
      }
    });
  });

  app.put('/api/branches/:id', function(req, res) {
    var accountId = req.session.accountId;
    var branchId = req.param('id', null);     
  
    if (null === branchId) {
      res.send(400);
      return;
    }

    models.Account.findById(accountId, function(account) {
      models.Tree.findBranch(branchId, function(branch) {
        models.Tree.findById(branch.tree, function(tree) {
          models.Tree.updateBranch(branchId, req.body, function(/*err*/) {
            models.Tree.updateTree(tree._id, {$set: {updateDate: new Date()}}, function(/*err*/) {
              models.Account.createActivity(account, 'BranchUpdated', branch.title, branch._id, 
                                            tree.name, tree._id, function(/*err*/) {
                res.send(200);
              });
            });
          });
        });
      });
    });
  });

  app.delete('/api/branches/:id', function(req, res) {
    var accountId = req.session.accountId;
    var branchId = req.param('id', null);     
  
    if (null === branchId) {
      res.send(400);
      return;
    }  
 
    models.Account.findById(accountId, function(account) { 
      models.Tree.findBranch(branchId, function(branch) {
        models.Tree.findById(branch.tree, function(tree) {
          models.Tree.updateTree(tree._id, {$set: {updateDate: new Date()}}, function(/*err*/) {
            models.Branch.deleteBranch(branchId);
            models.Account.createActivity(account, 'BranchDeleted', branch.name, branchId, tree.name, tree._id, function(/*err*/) {
              res.send(200);
            });
          });
        });
      });
    });
  });
};