(function () {
    'use strict';

    angular.module('app', ['ui.router','ngStorage','ngAnimate','ui.bootstrap','ngSanitize','ngFileUpload']);

    angular.module('app').config(['$stateProvider', '$urlRouterProvider','$compileProvider', function ($stateProvider, $urlRouterProvider,$compileProvider) {

        $compileProvider.debugInfoEnabled(false);

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'HTMLpages/home.html',
                controller: 'home-controller'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'HTMLpages/login.html',
                controller: 'login-controller'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'HTMLpages/register.html',
                controller: 'register-controller'
            })
            .state('profile', {
                url: '/profile/{id}',
                templateUrl: 'HTMLpages/profile.html',
                controller: 'profile-controller',
                controllerAs: 'up'
            })
            .state('messages', {
                url: '/messages',
                templateUrl: 'HTMLpages/messages.html',
                controller: 'messages-controller'
            })
            .state('friendRequests', {
                url: '/friend-requests',
                templateUrl: 'HTMLpages/friendRequests.html',
                controller: 'friend-Requests-controller'
            })
    }]);
})();