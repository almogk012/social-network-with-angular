(function () {
    'use strict';

    angular
        .module('app')
        .controller('app-controller', function ($scope, DataService, $localStorage, $location, $http) {

            if ($localStorage.user) {
                $scope.isUserIn = true;
                var user = DataService.getUser();
                $scope.nameInNavbar = user.firstname;
            }
            else {
                $scope.isUserIn = false;
            }

            $scope.getFriends = function () {
                var user = DataService.getUser();
                $http.get('http://localhost:4730/listFriends/' + user.id).then(function (res) {
                    $scope.friends = res.data;
                }, function () {

                })
            };

            $scope.$on('user-logged-in', function (event, args) {
                $scope.isUserIn = true;
                var user = DataService.getUser();
                $scope.nameInNavbar = user.firstname;
            });

            $scope.logout = function () {
                localStorage.removeItem("ngStorage-user"); // localStorage.clear(); option 2
                $scope.nameInNavbar = null;
                $scope.isUserIn = false;
                $location.path('/home');
                $scope.deletedConfirm = 'Deleted';
            };

            $(window).scroll(function () {
                if ($(this).scrollTop() > 100) {
                    $('.goToTop').fadeIn();
                } else {
                    $('.goToTop').fadeOut();
                }
            });
            $('.goToTop').click(function () {
                $("html, body").animate({scrollTop: 0}, 1000);
                return false;
            });
        });


// title="Click me" data-toggle="tooltip" data-placement="top" tooltip
//
// angular.module('app').directive('tooltip', function(){
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs){
//             $(element).hover(function(){
//                 // on mouseenter
//                 $(element).tooltip('show');
//             }, function(){
//                 // on mouseleave
//                 $(element).tooltip('hide');
//             });
//         }
//     };
// });

})();


