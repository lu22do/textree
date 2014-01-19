module.exports = function(app, config, mongoose, nodemailer) {
  var crypto = require('crypto');
  var Schema = mongoose.Schema;

  var ActivitySchema = new Schema({
    date: {type: Date},
    type: {type: String},  // TreeCreated, TreeDeleted, BranchCreated, BranchUpdated, 
                           // BranchDeleted, ContactAdded, ContactRemoved  
    // Related items:
    relName: {type: String},   
    relId: {type: Schema.ObjectId},
    relName2: {type: String}, // identifies the tree for branch activities   
    relId2: {type: Schema.ObjectId}
  });

  var schemaOptions = {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  };

  var ContactSchema = new Schema({
    pseudo: String,
    name: {
      first: {type: String},
      last: {type: String}       
    },
    accountId: {type: Schema.ObjectId},
    added: {type: Date},
    updated: {type: Date} /* ??? */
  }, schemaOptions);

  var AccountSchema = new Schema(
  {
    email: {type: String, unique: true},
    password: {type: String},
    pseudo: {type: String},
    admin: {type: Boolean},
    name: {
      first: {type: String},
      last: {type: String},
      full: {type: String}
    },
    birthday: {
      day: {type: Number, min: 1, max: 31, required: false},
      month: {type: Number, min: 1, max: 12, required: false},
      year: {type: Number}
    },
    photoUrl: {type: String},
    biography: {type: String},
    trees: [Schema.Types.ObjectId],
    contacts: [ContactSchema],
    activities: [ActivitySchema] 
  });

  var Account = mongoose.model('Account', AccountSchema);

  var registerCallback = function(err) {
    if (err) {
      return console.log(err);
    }
    return console.log('Account was created');
  };

  var register = function(email, password, pseudo, firstName, lastName) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);

    var fullName = firstName;
    if (lastName.length > 0)
        fullName += ' ' + lastName;

    console.log('Registering ' + email);
    var user = new Account({
      email: email,
      password: shaSum.digest('hex'),
      pseudo: pseudo,
      name: {
        first: firstName,
        last: lastName,
        full: fullName
      }
    });
    user.save(registerCallback);
    console.log('Save command sent');
  };

  var forgotPassword = function(email, resetPasswordUrl, callback) {
    Account.findOne({email: email}, function findAccount(err, doc) {
      if (err) {
        callback(false);
      } 
      else {
        var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
        smtpTransport.sendMail({
          from: 'thisapp@example.com',
          to: doc.email,
          subject: 'SocialNet Password Reset',
          text: 'Click here to reset your password: ' + resetPasswordUrl
        }, function forgortPasswordResult(err) {
          if (err) {
            callback(false);
          } else {
            callback(true);
          }
        });
      }
    });
  };

  var changePassword = function(accountId, newpassword) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(newpassword);
    var hashedpassword = shaSum.digest('hex');
    Account.update({_id: accountId}, {$set: {password:hashedpassword}}, {upsert: false}, 
      function changePasswordCallback(/*err*/) {
        console.log('Change password done for account' + accountId);
    });
  };

  var login = function(email, password, callback) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);
    Account.findOne({email: email, password: shaSum.digest('hex')}, function(err, doc) {
      callback(doc);
    });
  };

  var findById = function(accountId, callback) {
    Account.findOne({_id: accountId}, function(err, doc) {
      callback(doc);
    });
  };

  var findByString = function(searchStr, callback) {
    var searchRegex = new RegExp(searchStr, 'i');
    Account.find({
      $or: [
        { pseudo:      { $regex: searchRegex } },
        { 'name.full': { $regex: searchRegex } },
        { email:       { $regex: searchRegex } }
      ]
    }, callback);
  };

  var addContact = function(account, addcontact) {
    console.log('addcontact.name=' + addcontact.name);
    var contact = {
      pseudo: addcontact.pseudo,
      name: {
        first: addcontact.name.first, 
        last: addcontact.name.last},
      accountId: addcontact._id,
      added: new Date(),
      updated: new Date()
    };
    account.contacts.push(contact);

    account.save(function (err) {
      if (err) {
        console.log('[addContact] Error saving account: ' + err);
      }
    });
  };

  var hasContact = function(account, contactId) {
    if (null === account.contacts) return false;

    account.contacts.forEach(function(contact) {
      if (contact.accountId == contactId) {
        return true;
      }
    });
    return false;
  };

  var removeContact = function(account, contactId) {
    if (null === account.contacts) return;

    account.contacts.forEach(function(contact) {
      if ( contact.accountId == contactId ) {
        account.contacts.remove(contact);
      }
    });
    account.save();
  };

  var createActivity = function(account, activityType, relName, relId, relName2, relId2, cb) {
    var activity = {
      date: new Date(),
      type: activityType, 
      relName: relName,
      relId: relId,
      relName2: relName2,
      relId2: relId2
    };

    // Keep at most 20 activities
    account.activities.splice(0, account.activities.length - 20); 
    account.activities.push(activity);

    account.save(function (err) {
      if (err) {
        console.log('[createActivity] Error saving account: ' + err);
      }
      if (cb) {
        cb(err);
      }
    });
  };

  var addTree = function(account, tree, save) {
    console.log('addTree.name=' + tree.name);
    account.trees.push(tree._id);

    if (save) {
      account.save(function (err) {
        if (err) {
          console.log('[addTree] Error saving account: ' + err);
        }
      });
    }
  };

  var removeTree = function(account, treeId) {
    if (null === account.trees) return;

    account.trees.forEach(function(tree) {
      if ( tree == treeId ) {
        account.trees.remove(tree);
      }
    });
    account.save();
  };

  return {
    register: register,
    forgotPassword: forgotPassword,
    changePassword: changePassword,
    login: login,
    findById: findById,
    findByString: findByString,
    hasContact: hasContact,
    addContact: addContact,
    removeContact: removeContact,
    createActivity: createActivity,
    addTree: addTree,
    removeTree: removeTree,
    Account: Account
  };
};