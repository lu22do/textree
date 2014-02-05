module.exports = function(app, config, mongoose) {
  var Schema = mongoose.Schema;

  var BranchSchema = new Schema({
    tree: {type: Schema.ObjectId},
    parent: {type: Schema.ObjectId},
    children: [Schema.Types.ObjectId],
    title: String,
    text: String,
    author: {
      pseudo: {type: String},
      accountId: {type: Schema.ObjectId},
    }
  });

  var Branch = mongoose.model('Branch', BranchSchema); 

  var TreeSchema = new Schema({
    name: String,
    description: String,
    author: {
      pseudo: {type: String},
      accountId: {type: Schema.ObjectId},
    },
    date: Date, // creation date
    updateDate: Date,
    nbBranches: Number, // not including root branch
    rootBranch: {type: Schema.ObjectId}
  });

  var Tree = mongoose.model('Tree', TreeSchema); 

  var createTree = function(name, description, pseudo, accountId, cb) {
    console.log('createTree ' + name + '+ pseudo ' + pseudo);
    
    var rootBranch = new Branch({
      tree: undefined,  
      parent: null,
      children: [],
      title: null,
      text: null,
      author: {
        pseudo: pseudo,
        accountId: accountId
      }
    });
    rootBranch.save(function(err) {
      if (err) {
        cb(err);
        return;
      }

      console.log('Rootbranch created');

      var date = new Date();

      var tree = new Tree({
        name: name,
        description: description,
        author: {
          pseudo: pseudo,
          accountId: accountId
        },
        date: date,
        updateDate: date,
        nbBranches: 0,
        rootBranch: rootBranch._id
      });
      tree.save(function(err, tree) {
        if (err) {
          cb(err);
          return;
        }
        console.log('Tree created');

        Branch.update({_id: rootBranch._id}, {tree: tree._id}, function(err) {
          cb(err, tree);
        });
      });
    });
    console.log('Save command sent');
  };

  var findById = function(treeId, callback) {
    Tree.findOne({_id: treeId}, function(err, doc) {
      callback(doc);
    });
  };

  var findByIds = function(treeIds, filter, count, exclude, callback) {
    var query = {};
    if (treeIds) {
      query._id = {$in: []};
      for (var i = 0; i < treeIds.length; i++) {
        query._id.$in.push(treeIds[i]);
      }
    }
    else if (exclude) {
      query['author.accountId'] = {$ne: exclude};
   //   query['author.pseudo'] = {$ne: "Ludi"};
    }
    var sorting;
    if (filter && filter == 'lastUpdated') {
      //query = {$query: query, $orderby: { updateDate: -1 } };
      sorting = {updateDate: -1};
    }
    if (count === undefined) {
      count = 0;
    }
    Tree.find(query).sort(sorting).limit(count).exec(function(err, doc) {
      callback(doc);
    });
  };

  var updateTree = function(treeId, update, cb) {
    console.log('updateTree treeId=' + treeId + ', update: ' + JSON.stringify(update));
    Tree.update({_id: treeId}, update, cb);
  };

  var deleteTree = function(treeId, cb) {
    console.log('deleteTree');

    Tree.findOne({_id: treeId}, function(err, tree) {
      Branch.findOne({_id: tree.rootBranch}, function(err, rootBranch) {
        _deleteBranch(null, rootBranch, true, function(err) {
          if (err) {
            if (cb) {
              cb(err);
            }
            return;          
          }

          Tree.remove({_id: treeId}, function(err, doc) {
            if (cb) {
              cb(err, doc);
            }
          });    
        });
      });
    });
  };

  var createBranch = function(branchId, title, text, pseudo, accountId, cb) {
    Branch.findOne({_id: branchId}, function(err, branch) {
      var newbranch = new Branch({
        tree: branch.tree,
        parent: branch._id,
        children: [],
        title: title,
        text: text,
        author: {
          pseudo: pseudo,
          accountId: accountId
        }
      });
      newbranch.save(function addBranchCb(err, newbranch /*, numberAffected*/) {
        branch.children.push(newbranch._id);
        branch.save(function(err) { 
          cb(err, newbranch);
        });
      });
    });
  };

  var _deleteChildBranch = function(parent, branch, cb) {
    if (branch.children.length) {
      Branch.findOne({_id: branch.children[0]}, function(err, childBranch) {
        _deleteBranch(branch, childBranch, true, function() {
          _deleteChildBranch(parent, branch, cb);          
        });
      });
    }      
    else {
      _deleteBranch(parent, branch, false, cb);
    }
  };

  var _deleteBranch = function(parent, branch, deleteChildren, cb) {
    if (deleteChildren) {
      _deleteChildBranch(parent, branch, cb); // will callback this function when done
      return;
    }
    else if (branch.children.length) {
      if (cb) {
        cb(new Error('Has children'));
        return;
      }
    }    

    if (parent) {
      // remove branch from parent
      parent.children.remove(branch._id);
      parent.save(function(/*err*/) {
        // delete the branch itself
        Branch.remove({_id: branch._id}, function(err) {
          if (cb) {
            cb(err);
          }
        });
      }); 
    }
    else {
      // delete the branch itself
      Branch.remove({_id: branch._id}, function(err) {
        if (cb) {
          cb(err);
        }
      });
    }
  };

  var updateBranch = function(branchId, update, cb) {
    console.log('updateBranch: ' + branchId + ' -> ' + update);
    Branch.update({_id: branchId}, {$set: update}, cb);
  };

  var deleteBranch = function(tree, branchId, deleteChildren, cb) {
    Branch.findOne({_id: branchId}, function(err, branch) {
      if (branch.parent === null) {
        cb(new Error('Cannot delete root branch'));
        return;     
      }
      Branch.findOne({_id: branch.parent}, function (err, parent) {
        _deleteBranch(parent, branch, deleteChildren, cb);
      });
    });
  };

  var findBranch = function(branchId, callback) {
    Branch.findOne({_id: branchId}, null, {lean: true}, function(err, doc) {
      callback(doc);
    });
  };

  var findBranches = function(branchIds, callback) {
    var query = {};
    if (branchIds) {
      query = {_id: {$in: []}};
      for (var i = 0; i < branchIds.length; i++) {
        query._id.$in.push(branchIds[i]);
      }
    }
    Branch.find(query, null, {lean: true}, function(err, doc) {
      callback(doc);
    });
  };

  return {
    createTree: createTree,
    findById: findById,
    findByIds: findByIds,
    updateTree: updateTree,
    deleteTree: deleteTree,
    createBranch: createBranch,
    updateBranch: updateBranch,    
    deleteBranch: deleteBranch,
    findBranch: findBranch,
    findBranches: findBranches,
    Tree: Tree
  };
};