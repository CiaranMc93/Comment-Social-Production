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

        var jsonData = {};

        //check if the form has been created or not.
        if ($scope.formData === undefined) {
            console.error("error in posting");
        }
        else
        {
            //get our weather data
            $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + $scope.formData.cityName + '&APPID=a21bc137c3ed492be60d8d6715396aab&units=metric')
            //map the response to json
            .success(function(data){

                jsonData = {
                    username : $scope.formData.username,
                    cityName : $scope.formData.cityName,
                    text : $scope.formData.text,
                    lat : data.coord.lat,
                    long : data.coord.lon,
                    temp : data.main.temp
                }   

                $http.post('/api/posts/reply/submitReply', jsonData).
                success(function(data) {
                    //redirect
                    if(data.redirect)
                    {
                        window.location = data.redirect;
                        //reset the data
                        jsonData = {};
                    }
                    else
                    {
                        //reset the form data to be nothing
                        $scope.formData = {};
                        //reset the data
                        jsonData = {};
                    }
                    
                }).error(function(data) {
                    console.error("Error in posting");
                })
            })
            .error(function(data) { 
                //give error back
                $scope.errorData = "City is Incorrect or Spelled Incorrectly";
                //reset the form data to be nothing
                $scope.formData = {};
                //reset the data
                jsonData = {};
            });
        }
    }
});