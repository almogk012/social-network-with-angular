(function () {
    'use strict';

    angular
        .module('app')
        .controller('home-controller',function ($scope) {

        $scope.isUserIn=false;
        $scope.$on('user-logged-in', function(event, args) {
            $scope.isUserIn=true;
        });
    });
})();


