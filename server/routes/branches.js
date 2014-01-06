
module.exports = function(app, models) {
  app.get('/api/branches/:id', function(req, res) {
    models.Tree.findBranch(req.params.id, function(tree) {
      res.send(tree);
    });
  });

  app.post('/api/branches', function(req, res) {
    var accountId = req.session.accountId;

    var parentId = req.param('parentId');
    var title = req.param('title');
    var text = req.param('text');

    if (null == parentId) {
      res.send(400);
      return;
    }

    models.Account.findById(accountId, function(account) {
      if (account) {
        models.Tree.findById(branch.tree, function(tree) {
          models.Tree.createBranch(parentId, title, text, account.pseudo, accountId, function(err, branch) {
            if (err) {
              console.log("Error creating branch: " + err);
              res.send(404);
            }
            else  {
              models.Account.createActivity(account, "BranchCreated", branch.title, branch._id, tree.name, tree._id, function(err) {
                res.send(200);
              });
            }
          });
        });        
      }
    });
  });

  app.put('/api/branches/:id', function(req, res) {
    var accountId = req.session.accountId;
    var branchId = req.param('id', null);     
  
    if (null == branchId) {
      res.send(400);
      return;
    }

    models.Account.findById(accountId, function(account) {
      models.Tree.findBranch(branchId, function(branch) {
        models.Tree.findById(branch.tree, function(tree) {
          models.Tree.updateBranch(branchId, req.body, function(err) {
            models.Account.createActivity(account, "BranchUpdated", branch.title, branch._id, 
              tree.name, tree._id, function(err) {
              res.send(200);
            });
          });
        });
      });
    });
  });

  app.delete('/api/branches/:id', function(req, res) {
    var branchId = req.param('id', null);     
  
    if (null == branchId) {
      res.send(400);
      return;
    }  
 
    models.Tree.findBranch(branchId, function(branch) {
      models.Tree.findById(branch.tree, function(tree) {
        models.Branch.deleteBranch(branchId);
        models.Account.createActivity(account, "BranchDeleted", branch.name, branchId, tree.name, tree._id, function(err) {
          res.send(200);
        });
      });
    });
  });
};