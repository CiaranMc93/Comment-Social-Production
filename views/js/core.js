var userInfo = angular.module('userInfo', []);


userInfo.controller('mainController', function($scope, $http) {

    $scope.submitUser = function() {

        $http.post('/api/',$scope.formData).
        success(function(data) {
            $scope.userData = data;
            
        }).error(function(data) {
            console.error("error in posting");
        })
    }
});
