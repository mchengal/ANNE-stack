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
    
    app.factory('authInterceptor', function ($rootScope, $q, $window, $location) {
      return {
          request: function (config) {
              config.headers = config.headers || {};
              if ($window.sessionStorage.token) {
                  config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
              }
              return config;
          },
          responseError: function (rejection) {
              if (rejection.status === 401) {
                  // handle the case where the user is not authenticated
              }
              $location.path('/login/unauth');
              return $q.reject(rejection);
          }
      };
  });
  app.config(function ($httpProvider) {
      $httpProvider.interceptors.push('authInterceptor');
  });
})();

