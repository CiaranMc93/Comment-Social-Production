var postReply = angular.module('postReply', []);

//define the controller
postReply.controller('replyTo', function($scope, $http) {

    //get the data when the submit post page is initialised
    $scope.reply = function() {

        $http.get('/api/posts/replyTo/data',$scope).
        success(function(data) {
            //bind our response data to our scope to use
            $scope.replyToPost = data;
            
        }).error(function(data) {
            console.error("error in posting");
        })
    }

    //handle the submitUser functionality
    $scope.postReply = function() {

        //check if the form has been created or not.
        if ($scope.formData === undefined) {
            console.error("error in posting");
        }
        else
        {

            $http.post('/api//posts/reply/submitReply',$scope.formData).
            success(function(data) {

               	window.location = data.redirect;
                
            }).error(function(data) {
                console.error("error in posting");
            })
        }
    }
});