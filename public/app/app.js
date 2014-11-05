(function () {
    'use strict';
    
    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)

        // Custom modules 
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions

        // 3rd Party Modules
        'ui.bootstrap',      // ui-bootstrap (ex: carousel, pagination, dialog)
        'ngDragDrop',
        'ngGrid'
    ]);
    
    // Handle routing errors and success events
    app.run(['$route',  function ($route) {
            // Include $route to kick start the router.
        }]);        
})();

//'use strict';

//angular.module('myApp',['ngRoute', 
//    'productConfigAdmin',
//    'productConfigurator'
//    ])
//    .config(['$routeProvider', function($routeProvider) {
//    $routeProvider
//        .when('/admin', {
//            templateUrl: 'app/admin/admin.html',
//            controller: 'ProductNodesController'
//        })
//        .when('/query', {
//            templateUrl: 'app/admin/query.html',
//            controller: 'QueryController'
//        })
//        .when('/configurator', {
//            templateUrl: 'app/configurator/configurator.html',
//            controller: 'WizardController'
//        })
//        .otherwise({
//            redirectTo: '/'
//    });
//}]);