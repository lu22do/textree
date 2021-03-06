var express = require('express');
var http = require('http');
var app = express();
var nodemailer = require('nodemailer');
var MongoStore = require('connect-mongo')(express);
var pjson = require('./package.json');
var dbPath = 'mongodb://localhost/textree';
var fs = require('fs');
var events = require('events');
var port = 8080;
var prod = process.env.NODE_ENV;
if (prod == undefined) {
  prod = 'dev';
}

if (process.env.DBPATH) {
  dbPath = process.env.DBPATH;
}
console.log('using dbPath: ' + dbPath);

if (process.env.PORT) {
  port = process.env.PORT;
}

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
  app.use(express.static(__dirname + '/client'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('textree secret key'));
  app.use(express.session({
    secret: app.sessionSecret,
    key: 'express.sid',
    store: new MongoStore({
      url: dbPath
    })
  }));
  mongoose.connect(dbPath, function onMongooseError(err) {
    if (err) throw err;
  });
});

// Import the routes
fs.readdirSync('routes').forEach(function(file) {
  if ( file[0] == '.' ) return;
  var routeName = file.substr(0, file.indexOf('.'));
  require('./routes/' + routeName)(app, models);
  console.log('loaded ' + routeName + ' route');
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
  res.render('index.jade', {
    prod: prod,
    version: pjson.version
  });
});

app.server.listen(port);
console.log('Textree server (v' + pjson.version + ', ' + prod + ') is listening to port ' + port + '.');