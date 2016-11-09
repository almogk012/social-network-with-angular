(function () {
    'use strict';

    angular
        .module('app')
        .controller('messages-controller', function ($http,$scope,$timeout,DataService) {

        var user = DataService.getUser();
        $scope.currentUser = user.id;
        $scope.currentName = user.firstname;
        $scope.date = new Date();

        $http.get('http://localhost:4730/messages/'+$scope.currentUser).then(function (res) {
            $scope.users = res.data;
        });

        $scope.Send = function (userToSend,message) {

            $http.post('http://localhost:4730/messages',
                {sender:$scope.currentName , id: userToSend.id, message: message,date:$scope.date})
                .then(function () {
                $scope.successMsgSend = true;
                $timeout(function () {
                    $scope.successMsgSend = false;
                },1200)
            });
            $scope.message = null;
        };
    });
})();

