    /*
     * Serve JSON to our AngularJS client
     */

var neo4j = require('neo4j-js');
var async = require('async');
var neo4JUrl = 'http://interactions:C0z0OZ70Oh7MriQHeNB5@interactions.sb02.stations.graphenedb.com:24789/db/data/';
var passport = require('passport');
var jwt = require('jsonwebtoken');

exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			//user.password = undefined;
			//user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
                  // We are sending the profile inside the token
                  var token = jwt.sign(user, 'secret-anne', { expiresInMinutes: 20 });

                  res.json({ token: token });
				}
			});
		}
	})(req, res, next);
};

exports.createNode = function (req, res) {
    //JSON. stringify is only available in mordern browers.....

    var node = req.body.node;
    //var retValue = '', error = '';

    neo4j.connect(neo4JUrl, function (errors, graph) {

        graph.createNode(node, function (err, n) {
            //if (err) {
            //    //error = (err);
            //} else {
            //    //retValue = (JSON.stringify(n));
            //}
            res.json({
                responseData: n,
                error: err
            });
        });
    });


};

exports.getNode = function(req, res) {
    var retValue = '';
    var nodeId = req.body.nodeId;
    neo4j.connect(neo4JUrl, function(errors, graph) {
        if (err) {
            retValue = err;
            return;
        }

        graph.getNode(nodeId, function(err, result) {
            retValue = result;
        });
        res.json({
            responseDate: retValue
        });
    });


};

exports.updateNode = function (req, res) {
    var nodeId = req.body.nodeId;
    var newNodeValues = req.body.node;
    var retValue = '';
   
    neo4j.connect(neo4JUrl, function (errors, graph) {

         async.series({
            one: function (callback) {
                graph.getNode(nodeId, function (err, result) {
                    if (err) {
                        callback(err, result);
                    }
                    else {
                        node = result;
                        callback(null, result);
                    }
                });
            },
            two: function (callback) {
                node.replaceAllProperties(newNodeValues, function(err, n) {
                    if (err) {
                        retValue = (err);
                        callback(err, n);
                    } else {
                        retValue = (JSON.stringify(n));
                        callback(null, n);
                    }

                });
            }
        },
        function (err, results) {
            // results is now equal to: {one: 1, two: 2}
            res.json({
                responseData:  {
                    level: results.level,
                    price: results.price,
                    name: results.name,
                    description: results.description,
                    id:nodeId
                }
            });
        });

        
    });

};

exports.deleteNode = function (req, res) {

    var nodeId = req.body.nodeId;
    var retValue = '';

    neo4j.connect(neo4JUrl, function (errors, graph) {
        // find out if the node has any active relationships.
        // if it does, delete relationship first and then delete node.
        var query = [
            'START n=node(' + nodeId + ' ) ',
            'MATCH n-[r]-()  ',
            'DELETE r'
        ].join('\n');


        async.series({
            one: function (callback) {
                graph.query(query, null, function (err, results) {
                    if (err) {
                        callback(err, results);
                    }
                    else {
                        callback(null, results);
                    }
                });
            },
            two: function (callback) {
                graph.deleteNode(nodeId, function (err, n) {
                    if (err) {
                        retValue = (err);
                        callback(err, n);
                    } else {
                        retValue = n;
                        callback(null, n);
                    }
                });
            }
        },
        function (err, results) {
            // results is now equal to: {one: 1, two: 2}
            res.json({
                responseData: null
        });
        });



    });


};


exports.runAdhocQuery = function (req, res) {
    var retValue = '', error = undefined;
    neo4j.connect(neo4JUrl, function (err, graph) {
        if (err)
            throw err;
        var query = req.body.query;

        graph.query(query, null, function (error, results) {
            if (error) {
                error = error;
            }
            else {
                retValue = results;
            }
            res.json({
                responseData: retValue,
                error: error
            });
        });

    });

};

exports.runQuery = function(query, callback) {

    neo4j.connect(neo4JUrl, function (err, graph) {
        if (err)
            callback(err, null);

        graph.query(query, null, function (error, results) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, results);
            }
            
        });

    });

};

exports.runParallelQueries = function(req, res) {

    var queries = req.body.queries;

    async.map(queries, exports.runQuery, function(err, result) {

        res.json({
            responseData: result,
            error: err
        });
    });

};


exports.createRelationship = function (req, res) {
    var startNodeId = req.body.startNodeId;
    var endNodeId = req.body.endNodeId;
    var relationshipName = req.body.relationshipName;
    var retValue = '';

    neo4j.connect(neo4JUrl, function (err, graph) {
        if (err)
            throw err;
        var query = [
            'START n=node(' + startNodeId + '), m=node(' + endNodeId + ')',
            'CREATE UNIQUE (n)-[:' + relationshipName + ']->(m)'
        ].join('\n');

        graph.query(query, null, function (error, results) {
            if (error) {
                retValue = err;
            }
            else {
                retValue = results;
            }
            res.json({
                responseData: retValue
            });
        });

    });


};


exports.deleteRelationship = function (req, res) {
    var realtionshipId = req.body.realtionshipId;
    var retValue = '';
    neo4j.connect(neo4JUrl, function (err, graph) {
        if (err)
            throw err;

        graph.deleteRelationship(realtionshipId, function (error, results) {
            if (error) {
                retValue = error;
            } else {
                retValue = results;
            }
            res.json({
                responseData: retValue
            });
        });
    });


};

exports.getAllNodes = function(req, res) {

     var retValue;

    neo4j.connect(neo4JUrl, function(err, graph) {
        if (err)
            throw err;
        var query;
       
            query = [
                     'MATCH (n)  ',
                     'WHERE n.tag=\'drugs\'',
                     'RETURN n'
                        ].join('\n');
        graph.query(query, null, function(err, results) {
            if (err) {
                retValue = err;
            } else {
                retValue = results;
            }

            res.json({
                responseData: retValue
            });
        });
    });

};
