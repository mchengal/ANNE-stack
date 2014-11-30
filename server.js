
/**
 * Module dependencies.
 */

// Setup 
// =================
var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var api = require('./routes/api');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var flash = require('connect-flash');
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var users = [
    { id: 1, username: 'guest', password: 'guestpass', email: 'guest@anne.com' },
    { id: 2, username: 'visitor', password: 'visitorpass', email: 'visitor@anne.com' }
];


function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}
function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});

// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object. In the real world, this would query a database;
// however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
    function(username, password, done) {
    // asynchronous verification, for effect...
        process.nextTick(function () {
        // Find the user by username. If there is no user with the given
        // username, or the password is not correct, set the user to `false` to
        // indicate failure and set a flash message. Otherwise, return the
        // authenticated `user`.
            findByUsername(username, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
                if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
                return done(null, user);
            })
        });
    }
));
// Create our app with express
var app = express();

// Configure all environments
// =================

app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use('/api', expressJwt({secret: 'secret-anne'}));
app.use(express.json());
app.use(express.urlencoded());
//for use with sessions
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());  // simulate DELETE and PUT
app.use(express.session({ cookie: { maxAge: 60000 }, secret: 'anne#'}));
// use flash messages
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));  // set the static files location /public/img will be /img for users

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// We only need a default route.  Angular will handle the rest.
app.get('/', function(request, response){
  response.sendfile("./public/index.html");
});

// Send to js file for routing
app.get('/json/neo4j.json', function(request, response){
  response.sendfile("json/neo4j.json");
});

// JSON API
app.post('/api/runAdhocQuery', api.runAdhocQuery);
app.post('/api/runParallelQueries', api.runParallelQueries);
app.post('/api/createNode', api.createNode);
app.post('/api/deleteNode', api.deleteNode);
app.post('/api/createRelationship', api.createRelationship);
app.post('/api/deleteRelationship', api.deleteRelationship);
app.post('/api/updateNode', api.updateNode);
app.post('/api/getNode', api.getNode);
app.get('/api/getAllNodes', api.getAllNodes);
app.post('/signin', api.signin);

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected. If
// the request is authenticated (typically via a persistent login session),
// the request will proceed. Otherwise, the user will be redirected to the
// login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


