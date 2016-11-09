(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http'];
    function AuthenticationService($http) {
        var service = {};

        service.Login = Login;

        return service;

        function Login(username, password) {
           return $http.post('http://localhost:4730/login', { username: username, password: password });
        }
    }
})();