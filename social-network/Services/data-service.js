(function () {
    'use strict';

    angular
        .module('app')
        .service('DataService', DataService);

    DataService.$inject = ['$localStorage'];

    function DataService($localStorage) {

        var service = {};
        this.isLoggedIn = false;

        service.setUserLogin = function setUserLogin(isLoggedIn) {
            this.isLoggedIn = isLoggedIn;
        };

        service.isUserLoggedIn = function () {
            return this.isLoggedIn;
        };

        service.setUser = function (user) {
            this.user = user;
            $localStorage.user=JSON.stringify(user);
        };

        service.getUser = function () {
            return JSON.parse($localStorage.user);
        };

        return service;
    }
})();