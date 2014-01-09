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
    // updateDate: Date,
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

      var tree = new Tree({
        name: name,
        description: description,
        author: {
          pseudo: pseudo,
          accountId: accountId
        },
        date: new Date(),
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

  var findByIds = function(treeIds, callback) {
    var query = {};
    if (treeIds) {
      query = {_id: {$in: []}};
      for (var i = 0; i < treeIds.length; i++) {
        query._id.$in.push(treeIds[i]);
      }
    }
    Tree.find(query, function(err, doc) {
      callback(doc);
    });
  };

  var deleteTree = function(treeId, cb) {
    console.log('deleteTree');
    Tree.remove({_id: treeId}, function(err, doc) {
      if (cb) {
        cb(err, doc);
      }
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
        branch.save(cb);
      });
    });
  };

  var _deleteBranch = function(parent, branch, cb) {
    // remove children recursively
    while (branch.children.length) {
      _deleteBranch(branch, branch.children[0]);
    }

    // remove branch from parent
    parent.children.remove(branch._id);
    parent.save();
    
    // delete the branch itself
    Branch.remove({_id: branch._id}, function(err) {
      if (cb) {
        cb(err);
      }
    });
  };

  var updateBranch = function(branchId, update, cb) {
    Branch.update({_id: branchId}, {$set: update}, cb);
  };

  var deleteBranch = function(tree, branchId, cb) {
    Branch.findOne({_id: branchId}, function(err, branch) {
      Branch.findOne({_id: branch.parent}, function (err, parent) {
        _deleteBranch(parent, branch, cb);
      });
    });
  };

  var findBranch = function(branchId, callback) {
    Branch.findOne({_id: branchId}, function(err, doc) {
      callback(doc);
    });
  };

  return {
    createTree: createTree,
    findById: findById,
    findByIds: findByIds,
    deleteTree: deleteTree,
    createBranch: createBranch,
    updateBranch: updateBranch,    
    deleteBranch: deleteBranch,
    findBranch: findBranch,
    Tree: Tree
  };
};