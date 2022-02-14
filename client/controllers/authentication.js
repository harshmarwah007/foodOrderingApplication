var app = angular.module("authentication",["ngCookies"])

// Register User

app.controller("registerCtrl",function($scope,$http,$location){
    console.log("registeration working")
    $scope.register= function (){
    var name = $scope.name;
    var email = $scope.email;
    var phone = $scope.phone;
    var password = $scope.password;
   
    
        $http({
            url:"http://localhost:3000/user/register",
            method:"POST",
            data:{
                name :name,
                email:email,
                phone:phone,
                password:password

            }
        }).then((response)=>{
            if(response.data.message == "registered"){
                alert("You Successfully got registered")
                $location.path("/login")
            }
        }).catch((error)=>{
            console.log("auth error",error)
            alert(error.data.message || error.data||"Some error occured")
        })

    }
})

// LOGIN


app.controller("loginCtrl",function($scope,$http,$location,$cookies){
   console.log("I am working")
    $scope.login = function(){
        var username = $scope.username;
        var password = $scope.password;
        $http({
            url:"http://localhost:3000/user/login",
            method:"POST",
            data: {
                email: username,
                password:password
            }
        }).then((response)=>{
            console.log("reached")
            $cookies.put("token",response.data.token);
            console.log("response",response)
            if(response.data.message == "loggedIn"){
                $location.path("/home")
            }
            else{
                alert("invalid Login")
            }
        }).catch((error)=>{
            {   console.log("auth error",error)
                alert(error.data.message || error.data||"Some error occured")
            }
            
        })


    }
})


// app.factory("user",function($http){

    

// })