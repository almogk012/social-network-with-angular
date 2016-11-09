(function () {
    'use strict';

    angular
        .module('app')
        .controller('login-controller', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', '$rootScope', 'DataService', '$scope'];
    function LoginController($location, AuthenticationService, $rootScope, DataService, $scope) {

       $scope.login = function() {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password)
                .then(function (res) {
                        $scope.warningMsg = false;
                        $scope.successMsg = true;
                        $scope.successLogIn = 'Login in a few seconds';
                        DataService.setUserLogin(true);
                        DataService.setUser(res.data);
                        $rootScope.$broadcast('user-logged-in');
                        $location.path('/profile/:' + res.data.id)
                    },
                    function (res) {
                        $scope.warningMsg = true;
                        $scope.errorLogIn = 'The username or password not correct , Please try again';
                        $scope.dataLoading = false;
                        $scope.username = null;
                        $scope.password = null;
                    });
        };
        $scope.warningMsg = false;
    }
})();