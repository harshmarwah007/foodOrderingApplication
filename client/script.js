

var app = angular.module("main",["ngRoute",'ngCookies'])

app.config(function($routeProvider){
    $routeProvider.when("/",{
        templateUrl:"./components/login.html",
        controller:"loginCtrl",
        resolve:{
            check:function ($location,$cookies){
                if(($cookies.get("token"))){
                    $location.path("/dashboard");
                }
            }
        },
    }).when("/login",{
        resolve:{
            check:function ($location,$cookies){
                if(($cookies.get("token"))){
                    $location.path("/dashboard");
                }
            }
        },
        templateUrl: "./components/login.html",
        controller:"loginCtrl"
    }).when("/register",{
        resolve:{
            check:function ($location,$cookies){
                if(($cookies.get("token"))){
                    $location.path("/dashboard");
                }
            }
        },
        templateUrl:"./components/register.html",
        controller:"registerCtrl"
    }).when("/dashboard",{
        
        resolve:{
            check:function ($location,$cookies){
                if(!($cookies.get("token"))){
                    $location.path("/login");
                }
            }
        },
        templateUrl:"./components/dashboard.html",
        controller:"dashboardCtrl"
    }).otherwise({
        template: "404"
    })
})

//! All controllers

app.controller("loginCtrl",function($scope,$http,$location,$cookies){

   
    $scope.login = function(){
        alert("you clicked")
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
            $cookies.put("token",response.data.token);
            console.log("response",response)
            if(response.data.message == "loggedIn"){
                $location.path("/dashboard")
            }
            else{
                alert("invalid Login")
            }
        }).catch((error)=>{
            {
                alert(error.data || "Some error occured")
            }
            
        })


    }
})


app.controller("dashboardCtrl",function($scope,$http,$cookies,$location){

    $scope.logOut = function(){
        
        console.log("LOGGED OUT")
        $cookies.remove("token")
        location.reload()
    }
   
    var cookieValue = $cookies.get('token')
    console.log("this is",cookieValue)
 //Get orders       
    $scope.orders =[]
        $http({
            url:"http://localhost:3000/food/order",
            method:"GET",
            // headers:{
            //     "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoeWFtQGdtYWlsLmNvbSIsImlkIjoiNjFlZTYwOTYxMjZmNGYyMmQwODMyYzdiIiwiaWF0IjoxNjQzMDEzMTgzLCJleHAiOjE2NDMwOTk1ODN9.qt5iAuDT4CeRhKwnKYqN535RgGVqedgxiO5StVN-uIg"
            // }
            headers:{
                "Authorization": cookieValue
            }
        }).then((response)=>{
             
            
         
            $scope.orders =response.data.orders.map((order)=>{

                return{
                orderId: order._id,
                date:order.date,
                dishList: order.dishList,
                orderAmount:order.orderAmount,
                orderStatus:order.orderStatus
                }

            })
        }).catch((error)=>(console.log(error)))


   


//Food Dishes and Modal 
    $scope.foodDishes = []
    $http({
        url:"http://localhost:3000/food/dishes",
        method:"GET",
    }).then((response)=>{
     
        $scope.foodDishes =response.data.dishes.map((item)=>
            {
                return{
                id: item._id,
                name:item.name,
                price :item.price,
                qty:1
                }
            }
        );
    }).catch((error)=>{
        console.log(error)
    })
   
      
      $scope.cart = [];
      
      var findItemById = function(items, id) {
        return _.find(items, function(item) {
          return item.id === id;
        });
      };
      
      $scope.getCost = function(item) {
        return item.qty * item.price;
      };
    
      $scope.addItem = function(itemToAdd) {
        
        var found = findItemById($scope.cart, itemToAdd.id);
        if (found) {
        found.qty += itemToAdd.qty;
         }
    else {
      $scope.cart.push(angular.copy(itemToAdd));}
        
      };
      $scope.totalAmount= null;
      $scope.getTotal = function() {
        var total =  _.reduce($scope.cart, function(sum, item) {
          return sum + $scope.getCost(item);
        }, 0);
        
        $scope.total = total;
        return total;
      };
      
      $scope.clearCart = function() {
        $scope.cart.length = 0;
      };
      
      $scope.removeItem = function(item) {
        var index = $scope.cart.indexOf(item);
        $scope.cart.splice(index, 1);
      };
      
    // creating order 


      $scope.createOrder= function(item){
        var retVal = confirm("Do you want to Confirm Order ?");
        if( retVal == true ) {
           
            $http(
                {
                url:"http://localhost:3000/food/order",
                method:"POST",
                // headers:{
                //     "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoeWFtQGdtYWlsLmNvbSIsImlkIjoiNjFlZTYwOTYxMjZmNGYyMmQwODMyYzdiIiwiaWF0IjoxNjQzMDEzMTgzLCJleHAiOjE2NDMwOTk1ODN9.qt5iAuDT4CeRhKwnKYqN535RgGVqedgxiO5StVN-uIg"
                // },
                headers:{
                    "Authorization":cookieValue
                },
                data:{
                    orderAmount: $scope.getTotal(),
                    dishList: $scope.cart 
                }
                }
            ).then(()=>(console.log("created"))).catch((error)=>(console.log(error)))

        } else {
           return false;
        }
        location.reload()
      }

})

// Register User

app.controller("registerCtrl",function($scope,$http,$location){
    
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
            alert(error.data)
        })

    }
})

