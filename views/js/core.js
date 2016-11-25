var userInfo = angular.module('userInfo', []);

// Create the factory that share the Data
userInfo.factory('Post', function(data){

    var myData = data;
    
  return { Field: '' };
});

//long and lat
var longitude;
var latitude;
var address;

//define the controller
userInfo.controller('mainController', function($scope, $http) {

    //handle the submitUser functionality
    $scope.getResponse = function() {

        //check if the form has been created or not.
        if ($scope.formData === undefined) {
            console.error("error in posting");
        }
        else
        {

            $http.post('/api/response',$scope.formData).
            success(function(data) {
                //bind our response data to our scope to use
                $scope.userData = data;
                //reset the form data to be nothing
                $scope.formData = {};
                
            }).error(function(data) {
                console.error("error in posting");
            })
        }
    }

    //handle the submitUser functionality
    $scope.submitPost = function() {

        //check if the form has been created or not.
        if ($scope.formData.text === undefined || $scope.formData.username === undefined || $scope.formData.cityName === undefined) {
            console.error("Error in posting");
        }
        else
        {

            /* HTTPS Code - Not as good as http code but less secure 
            $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.formData.cityName + '+FL&sensor=false')
            .success(function(data){
                
                if(data.status == "OK")
                {
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
                            post : $scope.formData.text,
                            lat : data.latitude,
                            long : data.longitude,
                            temp : data.currently.temperature
                        }   

                        //pass in the data array we just created
                        $http.post('/api/submit', jsonData).
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
                else
                {
                    //give error back
                    $scope.errorData = "City is Incorrect or Spelled Incorrectly";
                    //reset the form data to be nothing
                    $scope.formData = {};
                    //reset the data
                    jsonData = {};
                }
            });*/
            
            //get our weather data
            $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + $scope.formData.cityName + '&APPID=a21bc137c3ed492be60d8d6715396aab&units=metric')
            //map the response to json
            .success(function(data){

                //put the weather data in an array as well as the form data
                jsonData = {
                    username : $scope.formData.username,
                    cityName : $scope.formData.cityName,
                    post : $scope.formData.text,
                    lat : data.coord.lat,
                    long : data.coord.lon,
                    temp : data.main.temp
                }   

                //pass in the data array we just created
                $http.post('/api/submit', jsonData).
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

    //get the data when the submit post page is initialised
    $scope.getData = function() {

        $http.get('/api/posts/getUserPosts',$scope.formData).
        success(function(data) {

            if(data.user == 'User Posts not Found')
            {
                console.error("Error in getting Post Data");
            }
            else
            {
                //bind our response data to our scope to use
                $scope.userData = data;
            }
            
            
        }).error(function(data) {
            console.error("error in posting");
        })
    }

    //get the data when the submit post page is initialised
    $scope.getAllPosts = function() {

        $http.get('/api/posts/getAllPosts',$scope.formData).
        success(function(data) {
            //bind our response data to our scope to use
            $scope.postData = data;
            
        }).error(function(data) {
            console.error("error in posting");
        })
    }

    //handle the submitUser functionality
    $scope.postSubmit = function() {

        var jsonData = {}

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
                    cityName : $scope.formData.cityName,
                    post : $scope.formData.text,
                    lat : data.coord.lat,
                    long : data.coord.lon,
                    temp : data.main.temp
                }   


                console.log(jsonData);

                //post the data
                $http.post('/api/posts/submitPost',jsonData).
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
                    console.error("error in posting");
                })

            })
            .error(function(data) { 
                console.error("Error in posting" + error);
            });
        }
    }

    //handle the reply option
    $scope.reply = function(id) {

        $http.post('/api/posts/replyTo', {'_id': id}).
        success(function(data) {

            $scope.userData = data;
            window.location = '/api/posts/reply';
            
        }).error(function(data) {
            console.error("error in posting");
        })
    }
});