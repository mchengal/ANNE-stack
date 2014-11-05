
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

// Create our app with express
var app = express();

// Configure all environments
// =================

app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());  // simulate DELETE and PUT
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



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


