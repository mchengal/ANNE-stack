(function () {
    'use strict';
    var controllerId = 'topnav';
    angular.module('app').controller(controllerId, ['common', '$window', topnav]);

    function topnav(common, $window) {
        var vm = this;
        //this is used to parse the profile
        vm.username = $window.sessionStorage.username || 'Not logged in';
        common.$rootScope.$on('loginSuccess', function(event, data){
             vm.username = $window.sessionStorage.username;
        });
    }

})()
