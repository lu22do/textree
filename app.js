var express = require('express');
var http = require('http');
var app = express();
var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var dbPath = 'mongodb://localhost/textree';
var fs = require('fs');
var events = require('events');

// Create an http server
app.server = http.createServer(app);

// Create an event dispatcher
var eventDispatcher = new events.EventEmitter();
app.addEventListener = function ( eventName, callback ) {
  eventDispatcher.on(eventName, callback);
};
app.removeEventListener = function( eventName, callback ) {
  eventDispatcher.removeListener( eventName, callback );        
};
app.triggerEvent = function( eventName, eventOptions ) {
  eventDispatcher.emit( eventName, eventOptions );
};

// Create a session store to share between methods
app.sessionStore = new MemoryStore();

// Import the data layer
var mongoose = require('mongoose');
var config = {
  mail: require('./config/mail')
};

// Import the accounts
var models = {
  Account: require('./models/Account')(app, config, mongoose, nodemailer),
  Tree: require('./models/Tree')(app, config, mongoose)
};

app.configure(function() {
  app.sessionSecret = 'textree secret key';
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/../client'));
  app.use(express.limit('1mb'));
  app.use(express.bodyParser());
  app.use(express.cookieParser("textree secret key"));
  app.use(express.session({
    secret: app.sessionSecret,
    key: 'express.sid',
    store: app.sessionStore}));
  mongoose.connect(dbPath, function onMongooseError(err) {
    if (err) throw err;
  });
});

// Import the routes
fs.readdirSync('routes').forEach(function(file) {
  if ( file[0] == '.' ) return;
  var routeName = file.substr(0, file.indexOf('.'));
  require('./routes/' + routeName)(app, models);
  console.log("loaded " + routeName + " route");
});

/* Test
models.Account.findById("52c2afcba8c5920e0e000003", function(account) {
    console.log("Account found");
  models.Tree.findByIds(account.trees, function(trees) {
    console.log("OK: " + trees);
  });
});
*/

app.get('/', function(req, res) {
  res.render("index.jade");
});

app.server.listen(8080);
console.log("SocialNet is listening to port 8080.");