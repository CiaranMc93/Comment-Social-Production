//replyController.js
/**
 * @summary This file is the file that allows the client to reply to comments by making post data from a form.
 *
 *
 * @since 14/11/2016
 * @author Ciaran McManus
 * @email ciaranmcmanus@live.ie
 */

var postReply = angular.module('postReply', []);

//variables for longitude and latitude
var longitude;
var latitude;
var address;

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
            //redirect in error
            window.location = '/api/submit';
        })
    }

    //handle the submitUser functionality
    $scope.postReply = function() {

        var jsonData = {};

        //check if the form has been created or not.
        if ($scope.formData.text === undefined || $scope.formData.username === undefined || $scope.formData.cityName === undefined) {
            console.error("error in posting");
        }
        else
        {

            /* HTTPS Code not as good as normal http code
            $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.formData.cityName + '+FL&sensor=false')
            .success(function(data){
                //need to get long and latitude in order to use the https weather API.
                latitude = data.results[0].geometry.location.lat;
                longitude = data.results[0].geometry.location.lng;
                address = data.results[0].formatted_address;

                //get our weather data
                $http.jsonp('https://api.darksky.net/forecast/76984268ebf01b3aa4f6def04218a573/' + latitude + ',' + longitude + '?callback=JSON_CALLBACK')
                //map the response to json
                .success(function(data){

                    //put the weather data in an array as well as the form data
                    jsonData = {
                        username : $scope.formData.username,
                        cityName : address,
                        text : $scope.formData.text,
                        lat : data.latitude,
                        long : data.longitude,
                        temp : data.currently.temperature
                    }   

                    //pass in the data array we just created
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
            });*/

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
                    //redirect in error
                    window.location = '/api/submit';
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