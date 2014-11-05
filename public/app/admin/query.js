(function () {
    'use strict';

    var controllerId = 'query';
    angular.module('app').controller(controllerId, ['common', 'datacontext', query]);

    function query(common, datacontext) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Ad-hoc Queries';
        vm.nodes = [];
        vm.sampleQueries = [
            {name: 'Show all drugs',
            query: ['Match (n)',
                   'Return n'
                   ].join('\n')
            },
            {name: 'Show all relationships',
            query: ['Match n-[r]->m',
                   'Return n,r,m'
                   ].join('\n')},
            
        ];
        vm.runQuery = runQuery;
        
        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Ad-hoc Query View'); });
        }

        function runQuery() {
            return datacontext.runAdhocQuery(vm.query).then(function (result) {
                return vm.nodes = result.data;
            });
        }

    }
})();
