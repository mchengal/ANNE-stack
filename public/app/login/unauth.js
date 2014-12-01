(function () {
    'use strict';
    var controllerId = 'unauth';
    angular.module('app').controller(controllerId, ['spinner', unauth]);

    function unauth(spinner) {
        var vm = this;
        vm.title = "Restricted. Unauthorized Access";
        spinner.spinnerHide();
    }
})()
