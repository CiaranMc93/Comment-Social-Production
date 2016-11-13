var userInfo = angular.module('userInfo', []);

//define the controller
userInfo.controller('mainController', function($scope, $http) {

    //handle the submitUser functionality
    $scope.submitUser = function() {

        $http.post('/api/login',$scope.formData).
        success(function(data) {
            //bind our response data to our scope to use
            $scope.userData = data;
            //clear the form
            $("#userForm")[0].reset();
            
        }).error(function(data) {
            console.error("error in posting");
        })
    }
});
