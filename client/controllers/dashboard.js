var app = angular.module("dashboard",['ngCookies'])


    app.controller("dashboardCtrl",function($scope,$http,$cookies){
  
      $scope.toggleModal = function(){
        $('#orderModal').modal('toggle');
      }


    

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
                $scope.orders =response.data.map((order)=>{
    
                    return{
                    orderId: order._id,
                    date:order.date,
                    dishList: order.dishList,
                    orderAmount:order.orderAmount,
                    orderStatus:order.orderStatus,
                    customerName:order.customerName,
                    customerContact:order.customerContact
                    }
    
                })
            }).catch((error)=>(console.log(error)))
    // change status 
            
      $scope.statusOptions = ["Preparing","Prepared"]
     $scope.statusChange = function (orderStatusValue,orderId,){

              

              $http({
                url:`http://localhost:3000/food/order/${orderId}`,
                method:"PATCH",
                data:{
                  orderStatus:orderStatusValue
                },
                headers:{
                  "Authorization":cookieValue
              },
              }).then((response)=>(console.log(response))).catch((error)=>(
                console.log(error)
              ))
       console.log(orderStatusValue,orderId);
    }     
      
       
    
    
    //Food Dishes and Modal 
        $scope.foodDishes = []
        $http({
            url:"http://localhost:3000/food/dishes",
            method:"GET",
        }).then((response)=>{
         
            $scope.foodDishes =response.data.map((item)=>
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
    
    
          $scope.createOrder= function(customerName,customerContact){
            if(!($scope.cart.length)){
              return alert("Add Items to Cart")
            }
       
            if(!customerContact && !customerName){
              return alert("Enter Customer Details")
            }
           
            console.log($scope.cart.length)
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
                        dishList: $scope.cart,
                        customerName:customerName,
                        customerContact:customerContact 
                    }
                    }
                ).then(()=>(console.log("created"))).catch((error)=>(console.log(error)))
                $scope.toggleModal();
                $('#orderModal').on('hidden.bs.modal', function () {
                  $('#orderModal form')[0].reset();
                  });
                $scope.cart=[]
                $scope.getTotal()



            } 

            
           
          
          }
    
    })
    