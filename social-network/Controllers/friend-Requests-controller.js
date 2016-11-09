(function () {
    'use strict';

    angular
        .module('app')
        .controller('friend-Requests-controller', function ($scope, DataService, $timeout, UserService,$http) {

            var user = DataService.getUser();

            UserService.GetAllPeopleMayKnow(user.id).then(function (res) {
                $scope.users = res.data;
            });

            $scope.addFriend = function (userToAdd) {
                $http.post('http://localhost:4730/send-friend-request', {
                    sendRequest: user,
                    getRequest: userToAdd,
                    approved: false
                }).then(function (res) {
                });
                $timeout(function () {
                    userToAdd.disabled = true;
                }, 1500)
            };

            UserService.GetAllFriendRequests().then(function (res) {
                $scope.all = res.data;
                $scope.allReqests = [];
                angular.forEach($scope.all, function (value, key) {
                    if (value.getter.id === user.id) {
                        $scope.allReqests.push(value.sender);
                    }
                });
            });

            $scope.addFriendToMyFriends = function (userToAdd) {
                angular.forEach($scope.all, function (value, key) {
                    if (value.sender.id === userToAdd.id) {
                        UserService.UpdateListFriends(user.id, value).then(function (res) {
                        });
                    }
                    $timeout(function () {
                        userToAdd.disabled = true;
                    }, 1500)
                });
            };
        });
})();

