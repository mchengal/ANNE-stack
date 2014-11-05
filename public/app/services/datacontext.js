(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId, ['common', datacontext]);

    function datacontext(common) {
        var $q = common.$q;
        var $http = common.$http;

        var service = {
            getPeople: getPeople,
            getMessageCount: getMessageCount,
            getStages: getStages,
            getAllNodes: getAllNodes,
            getAllRelationships: getAllRelationships,
            createConfig: createConfig,
            runAdhocQuery: runAdhocQuery,
            runParallelQueries: runParallelQueries,
            createAssemblyRelationship: createAssemblyRelationship,
            createRelationshipByNodeId  :  createRelationshipByNodeId,
            deleteRelationshipByNodeId : deleteRelationshipByNodeId,
            getMEPGroups: getMepGroups,
            updateNode: updateNode,
            deleteNode: deleteNode,
            createNode: createNode,
            addNode: addNode
        };

        return service;

        function getMessageCount() { return $q.when(72); }

        function getPeople() {
            var people = [
                { firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida' },
                { firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California' },
                { firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York' },
                { firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota' },
                { firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota' },
                { firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina' },
                { firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming' }
            ];
            return $q.when(people);
        }

        function getStages() {
            // TODO:  Figure out how he is retrieving...  $http, $resource, something else.
            var stages = $http.get('/api/getStageConfig');
            return stages.success(function (data, status, headers, config) {
                var arr = JSON.parse(data.responseData[0].n.data.stageArray);
                //return arr;
            });
            // TODO: Change this over to $q

            //return $q.success.when(stages);
        }

        function getAllNodes() {

            var nodes = $http.get('/api/getAllNodes');

            return $q.when(nodes);
        }

        function createConfig(arr) {
            var call = $http({
                method: 'POST',
                data: { configArray: arr },
                url: '/api/createConfig',
                headers: { 'Content-Type': 'application/json' }
            });

            return $q.when(call);
        }

        function runAdhocQuery(query) {

            var call = $http({
                method: 'POST',
                data: { query: query },
                url: '/api/runAdhocQuery',
                headers: { 'Content-Type': 'application/json' }
            });

            return $q.when(call);
        }

        function runParallelQueries(queries) {
            

            var call = $http({
                method: 'POST',
                data: { queries: queries},
                url: '/api/runParallelQueries',
                headers: { 'Content-Type': 'application/json' }
            });

            return $q.when(call);

        }

        function updateNode(nodeId, node) {

            var call = $http({
                method: 'POST',
                data: { nodeId: nodeId, node: node },
                url: '/api/updateNode',
                headers: { 'Content-Type': 'application/json' }
            });

            return $q.when(call);
        }

        function createNode(node) {

            return addNode(node);
        }

        function addNode(node) {
            
           var call = $http({
                method: 'POST',
                data: { node: node },
                url: '/api/createNode',
                headers: { 'Content-Type': 'application/json' }
            });

            return $q.when(call);
        }

        function deleteNode(nodeId) {

            var call = $http({
                method: 'POST',
                data: { nodeId: nodeId },
                url: '/api/deleteNode',
                headers: { 'Content-Type': 'application/json' }
            });

            return $q.when(call);
        }

        function getAllRelationships(){
            var query = "MATCH (n)-[r]->(m) RETURN n,r,m";
            return runAdhocQuery(query);
        }

        // takes in ids of the 2 nodes
        function createRelationshipByNodeId(node1, node2, relationshipName, properties) {
            var query = "MATCH (n), (m) WHERE id(n) = " + node1 + " and id(m) = " + node2;
            query += " CREATE UNIQUE (n)-[rs:" + relationshipName + " " + jsonifyObjectForNeo4J(properties) + "]->(m) ";
            query += " RETURN rs ";

            
            return runAdhocQuery(query);

        }

        // takes in ids of the 2 nodes and relationship name to delete
        function deleteRelationshipByNodeId(node1, node2, relationshipName, properties) {
            var query = "MATCH (n)-[rs:"+relationshipName+" "+jsonifyObjectForNeo4J(properties) + "]->(m) where id(n) = " + node1 + " and id(m) = " + node2;
            query += " DELETE rs";
            //alert(query);
            return runAdhocQuery(query);
        }

        function jsonifyObjectForNeo4J(obj) {
            var result = '';
            obj = obj || {};
            var values = JSON.stringify(obj).split(',');
            
            for (var k = 0; k < values.length; k++) {
                var string = values[k].split(':');
                for (var i = 0; i < string.length - 1; i += 2) {

                    result += string[i].replace(/"/g, "") + " : " + string[i + 1] + " ,";
                }
            }
            result = result.slice(0, -1);
            return result;

        }

        function createAssemblyRelationship(part, stages, startNode) {
            //ok i have the part, so get the stage it belongs to
            
            var partStage = part.stageName;
            var index = -1;
            //now find index of this stage in the stages array
            for (var i = 0; i < stages.length; i++) {
                if (stages[i].name == partStage) {
                    index = i;
                    break;
                }
                    
            }

            // ok so i have the stage level, now what?
            // if this is the first stage, then create the start node and set relationship from start node to this part

            //ok so that did nto work....
            // split the query into 2


            var query2 = "", query = "MATCH (s), (n) WHERE ";

            if (index == 0) {
                // first stage, so create relationships from startNode
                query += " id(s) = " + startNode.id;
            } else {
                query += " s.label= 'Assembly' and s.assemblyId = '" + startNode.id + "' and s.stageName = '"+stages[index-1].name+"'";
            }

            query += " and id(n) = " + part.id  ;
            query += " CREATE UNIQUE (s)-[rs:SELECT_ONE]->(n) ";
            query += " RETURN rs ";

            // now create the 2nd piece

            
            if (index != stages.length-1) {
                query2 = "MATCH (n), (m) WHERE ";
                query2 += " id(n) = " + part.id;
                query2 += " and m.label= 'Assembly' and m.assemblyId = '" + startNode.id + "' and m.stageName = '" + stages[index + 1].name + "'";
                query2 += " CREATE UNIQUE (n)-[rs:SELECT_ONE]->(m)";
                query2 += " RETURN  rs ";

            }


            return runParallelQueries([query, query2]);

            
            /*
            what do i need here??
            reference to all nodes in the next stage...
            so i have stage name, and startNode id, so i can get all nodes based on that.
            then take current part and create realtionshipt to all those nodes...

            what about exclusions?
            and what about relationships to the next stage if all nodes in current stage are excluded?

            */


        }

        //given stage name, get the all the mutually exclusive relationships in this stage.
        function getMepGroups(stage) {
            var query = [
                "MATCH (n)-[rs:MUTUALLY_EXCLUSIVE]->(m) ",
                " WHERE n.stageName = '" + stage.name + "' ",
                " RETURN rs "
            ].join('\n');

            return runAdhocQuery(query);
        }

    }

})();