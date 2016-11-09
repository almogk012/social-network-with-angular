(function () {
    'use strict';

    angular
        .module('app')
        .controller('profile-controller', function ($scope, $http, $timeout, DataService, UserService, $window, Upload) {

            // $http.get('http://localhost:4730/upload').then(function (res) {
            //     $scope.files = res.data;
            // });
            //
            // var vm = this;
            // vm.submit = function () { //function to call on form submit
            //     if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            //         vm.upload(vm.file); //call upload function
            //     }
            // };
            //
            // vm.upload = function (file) {
            //     Upload.upload({
            //         url: 'http://localhost:4730/upload', //webAPI exposed to upload the file
            //         data: {file: file} //pass file as data, should be user ng-model
            //     }).then(function (resp) { //upload function returns a promise
            //         if (resp.data.error_code === 0) { //validate success
            //             $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
            //         } else {
            //             $window.alert('an error occured');
            //         }
            //     }, function (resp) { //catch error
            //         console.log('Error status: ' + resp.status);
            //         $window.alert('Error status: ' + resp.status);
            //     }, function (evt) {
            //         console.log(evt);
            //         var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            //         console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            //         vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            //     });
            // };

            var user = DataService.getUser();
            $scope.Fname = user.firstname;
            $scope.Lname = user.lastname;
            $scope.defaultImage = 'Images/images.jpg';

            if (user.about !== '') {
                $scope.about = user.about;
            }

            $scope.myInterval = 3000;
            $scope.active = 0;
            var slides = $scope.slides = [];
            var currIndex = 0;

            $scope.addSlide = function () {
                var newWidth = 600 + slides.length + 1;
                slides.push({
                    image: '//unsplash.it/' + newWidth + '/300',
                    text: ['Nice image', 'Awesome photograph', 'That is so cool', 'I love that'][slides.length % 4],
                    id: currIndex++
                });
            };

            for (var i = 0; i < 4; i++) {
                $scope.addSlide();
            }

            // http://stackoverflow.com/questions/962802#962890
            function shuffle(array) {
                var tmp, current, top = array.length;

                if (top) {
                    while (--top) {
                        current = Math.floor(Math.random() * (top + 1));
                        tmp = array[current];
                        array[current] = array[top];
                        array[top] = tmp;
                    }
                }

                return array;
            }

            $(document).ready(function () {
                $('#my-file-selector').on('change', function () {
                    var files = $(this).get(0).files;

                    if (files.length > 0) {
                        $scope.tmp = $(this).val();
                    }
                })
            });
            $scope.Interests = [{name: "football"}, {name: "basketball"}, {name: "swimming"}, {name: "comics"},
                {name: "travling"}, {name: "cooking"}, {name: "reading"}, {name: "learning"}, {name: "history"},
                {name: "athletics"}, {name: "Biology"}, {name: "theater"}, {name: "Ping pong"}
            ];

            this.tab = 1;
            $scope.selectedTab = function (setTab) {

                this.tab = setTab;

                if (this.tab === 1) {
                    $http.get('http://localhost:4730/profile/' + user.id).then(function (res) {
                        $scope.data = res.data;
                        $timeout(function () {
                            $scope.data = res.data;
                        }, 0);
                    })
                }
            };
            $scope.FillAbout = function (about) {
                UserService.FillAbout(user.id, about).then(function (res) {

                    $scope.$watch('$scope.about', function () {
                        $scope.about = res.data;
                    });
                });
            };
        })


        .directive("fileread", [function () {
            return {
                scope: {
                    fileread: "="
                },
                link: function (scope, element, attributes) {
                    element.bind("change", function (changeEvent) {
                        scope.$apply(function () {
                            scope.fileread = changeEvent.target.files[0];
                            // or all selected files:
                            // scope.fileread = changeEvent.target.files;
                        });
                    });
                }
            }
        }])
})();




