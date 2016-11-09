(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http'];
    function UserService($http) {
        var service = {};

        service.GetAllPeopleMayKnow = GetAllPeopleMayKnow;
        service.GetAllFriendRequests = GetAllFriendRequests;
        service.UpdateListFriends = UpdateListFriends;
        service.Create = Create;
        service.FillAbout = FillAbout;
        service.Delete = Delete;

        return service;

        function GetAllPeopleMayKnow(id) {
            return $http.get('http://localhost:4730/people-you-may-know/' + id)
        }

        function GetAllFriendRequests() {
            return $http.get('http://localhost:4730/get-all-friend-requests')
        }

        function UpdateListFriends(id, value) {
            return $http.put('http://localhost:4730/update-list-friends/' + id, {request: value})
        }

        function Create(user) {
            return $http.post('http://localhost:4730/register', user)
        }

        function FillAbout(_id,_about) {
            return  $http.put('http://localhost:4730/profile/', {id: _id, textAbout: _about})
        }

        function Delete(id) {
            return $http.delete('http://localhost:4730/' + id)
        }
    }
})();