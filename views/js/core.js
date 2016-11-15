var userInfo = angular.module('userInfo', []);

//define the controller
userInfo.controller('mainController', function($scope, $http) {

    //handle the submitUser functionality
    $scope.submitTaskTwoAndThree = function() {

        $http.post('/api/response',$scope.formData).
        success(function(data) {
            //bind our response data to our scope to use
            $scope.userData = data;
            //clear the form
            $("#userForm")[0].reset();
            
        }).error(function(data) {
            console.error("error in posting");
        })
    }

    //handle the submitUser functionality
    $scope.submitUser = function() {

        $http.post('/api/submit',$scope.formData).
        success(function(data) {
            //bind our response data to our scope to use
            $scope.userData = data;
            //clear the form
            $("#userForm")[0].reset();
            
        }).error(function(data) {
            console.error("error in posting");
        })
    }

    //handle the userSignup functionality
    $scope.userSignup = function() {

        $http.post('/api/signup',$scope.formData).
        success(function(data) {
            //bind our response data to our scope to use
            $scope.userData = data;
            //clear the form
            $("#userForm")[0].reset();
            
        }).error(function(data) {
            console.error("error in posting");
        })
    }

    //handle the userLogin functionality
    $scope.userLogin = function() {

        $http.post('/api/login',$scope.formData).
        success(function(data) {
            //bind our response data to our scope to use
            $scope.userData = data;

            //redirect
            window.location = data.redirect;

            //clear the form
            $("#userForm")[0].reset();
            
        }).error(function(data) {
            console.error("error in posting");
        })
    }
});
