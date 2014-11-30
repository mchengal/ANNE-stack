(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['common', 'datacontext', '$window', dashboard]);

    function dashboard(common, datacontext, $window) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var $http = common.$http;

        var vm = this;
        vm.news = {
            title: 'Hot Towel Angular',
            description: 'Hot Towel Angular is a SPA template for Angular developers.'
        };
        vm.message ={} ;
        vm.people = [];
        vm.title = 'Dashboard';

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });
        }
        //this is used to parse the profile
        function url_base64_decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
            }
            return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
        }

        vm.signin = function(){
            var credentials = {};
            credentials.username = 'guest';
            credentials.password= 'guestpass';
            $http.post('/signin', credentials).success(function(response) {
				// If successful we assign the response to the global user model
                $window.sessionStorage.token = response.token;
                var $scope_isAuthenticated = true;
                var encodedProfile = response.token.split('.')[1];
                var profile = JSON.parse(url_base64_decode(encodedProfile));
                //$scope.welcome = 'Welcome ' + profile.first_name + ' ' + profile.last_name;
                vm.message.user = profile;

				// And redirect to the index page
				//$location.path('/');
			}).error(function(response) {
				vm.message.user = response.message;
			});
        }
    }
})();