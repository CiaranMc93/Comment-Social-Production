var userInfo = angular.module('userInfo', []);

// Create the factory that share the Data
userInfo.factory('Post', function(data){

    var myData = data;
    
  return { Field: '' };
});

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
    $scope.submitUser = function() {

        //check if the form has been created or not.
        if ($scope.formData === undefined) {
            console.error("error in posting");
        }
        else
        {

            $http.post('/api/submit',$scope.formData).
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

    //handle the userSignup functionality
    $scope.userSignup = function() {

        //check if the form has been created or not.
        if ($scope.formData === undefined) {
            console.error("error in posting");
        }
        else
        {

            $http.post('/api/signup',$scope.formData).
            success(function(data) {
                //bind our response data to our scope to use
                $scope.userData = data;

                //redirect
                if(data.redirect)
                {
                    window.location = data.redirect;
                }
                else
                {
                    //reset the form data to be nothing
                    $scope.formData = {};
                }
                
            }).error(function(data) {
                console.error("error in posting");
            })
        }
    }

    //handle the userLogin functionality
    $scope.userLogin = function() {

        //check if the form has been created or not.
        if ($scope.formData === undefined) {
            console.error("error in posting");
        }
        else
        {
            $http.post('/api/login',$scope.formData).
            success(function(data) {
                //bind our response data to our scope to use
                $scope.userData = data;

                //redirect
                if(data.redirect)
                {
                    window.location = data.redirect;
                }
                else
                {
                    //reset the form data to be nothing
                    $scope.formData = {};
                }
                
            }).error(function(data) {
                console.error("error in posting");
            })
        }
    }
});

       

//define the controller
userInfo.controller('getData', function($scope, $http) {

    //get the data when the submit post page is initialised
    $scope.getData = function() {

        $http.get('/api/posts/getUserPosts',$scope.formData).
        success(function(data) {
            //bind our response data to our scope to use
            $scope.userData = data;
            
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
