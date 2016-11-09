(function () {
    'use strict';

    angular
        .module('app')
        .controller('register-controller', RegisterController);

    RegisterController.$inject = ['UserService', '$location', '$scope', '$timeout'];
    function RegisterController(UserService, $location, $scope) {

        $scope.success = false;

        $scope.register = function () {
            $scope.dataLoading = true;

            UserService.Create($scope.user)
                .then(function (res) {
                        $scope.success = true;
                        $location.path('/login');
                    },
                    function (res) {
                        $scope.warningMsgReg = true;
                        $scope.errorReg = res.data;
                        $scope.dataLoading = false;

                    });
        };
    }
})();