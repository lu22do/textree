
module.exports = function(app, models) {

  app.get('/api/branches/:id', function(req, res) {
    models.Tree.findBranch(req.params.id, function(branch) {
      if (!branch) {
        res.send(404);
        return;
      }

      var branch2 = {
        author: branch.author,
        parent: branch.parent,
        text: branch.text,
        title: branch.title,
        tree: branch.tree        
      };
      res.send(branch2);
    });
  });

  app.get('/api/branches/:id/children', function(req, res) {
    models.Tree.findBranch(req.params.id, function(branch) {
      var len = branch.children.length;
      if (0 === len) {
        res.send([]);
      } 
      else {
        models.Tree.findBranches(branch.children, function(childBranches) {
          res.send(childBranches);
        });
      }
    });
  });

  app.get('/api/branches/hierarchy/:id', function(req, res) {
    models.Tree.getHierarchy(req.params.id, function(err, hierarchy) {
      if (err) {
        res.send(500);
        return;
      }
      res.send(hierarchy);
    });
  });

  app.post('/api/branches', function(req, res) {
    var accountId = req.session.accountId;

    var parentId = req.param('parentId'); // parent branch to attach new branch to
    var title = req.param('title');
    var text = req.param('text');

    if (!parentId) {
      res.send(400);
      return;
    }

    models.Account.findById(accountId, function(account) {
      if (!account) {
        res.send(500);
        return;
      }

      models.Tree.findBranch(parentId, function(parentBranch) {
        if (!parentBranch) {
          console.log('Cannot find parent branch: ' + parentId);
          res.send(500);
          return;
        }

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
                  res.send({id: branch._id})
                });
              });
            }
          });
        });
      });        
    });
  });

  app.put('/api/branches/:id', function(req, res) {
    var accountId = req.session.accountId;
    var branchId = req.param('id', null);     
  
    if (!branchId) {
      res.send(400);
      return;
    }

    models.Account.findById(accountId, function(account) {
      models.Tree.findBranch(branchId, function(branch) {
        if (!branch.author.accountId.equals(accountId)) {
          res.send(405); // 'not allowed'
          return;
        }

        models.Tree.findById(branch.tree, function(tree) {
          if (!tree) {
            res.send(500);
            return;
          }

          models.Tree.updateBranch(branchId, req.body, function(err) {
            if (err) {
              res.send(500);
              return;
            }

            models.Tree.updateTree(tree._id, {$set: {updateDate: new Date()}}, function(err) {
              if (err) {
                res.send(500);
                return;
              }

              var title = req.body.title ? req.body.title : branch.title;
              models.Account.createActivity(account, 'BranchUpdated', title, branch._id, 
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
  
    if (!branchId) {
      res.send(400);
      return;
    }  
 
    models.Account.findById(accountId, function(account) { 
      models.Tree.findBranch(branchId, function(branch) {
        if (!branch.author.accountId.equals(accountId)) {
          res.send(405); // 'not allowed'
          return;
        }
        models.Tree.findById(branch.tree, function(tree) {
          models.Tree.deleteBranch(tree, branchId, false, function(err) {
            if (err) {
              res.send(405); // 'not allowed'
              return;
            }
            models.Tree.updateTree(tree._id, {$set: {updateDate: new Date()}, $inc: {nbBranches: -1}}, function(/*err*/) {
              models.Account.createActivity(account, 'BranchDeleted', branch.title, branchId, tree.name, tree._id, function(/*err*/) {
                res.send(200);
              });
            });
          });
        });
      });
    });
  });
};