

var app = angular.module("main",[
    "ngRoute",
    'ngCookies',"ui.router","dashboard","authentication"])

app.config(function($stateProvider,$urlRouterProvider){

    $stateProvider.state("login",{
        resolve:{
            check:function ($location,$cookies){
                if(($cookies.get("token"))){
                    $location.path("/home");
                }
            }
        },
        url:"/login",
        templateUrl:"./components/login.html",
        controller:"loginCtrl",
    }).state("register",{
        resolve:{
            check:function ($location,$cookies){
                if(($cookies.get("token"))){
                    $location.path("/home");
                }
            }
        },
        url:"/register",
        templateUrl:"./components/register.html",
        controller:"registerCtrl"
    })
    // .state("root",{
    //     resolve:{
    //         check:function ($location,$cookies){
    //             if(($cookies.get("token"))){
    //                 $location.path("/home");
    //             }
    //         }
    //     },
    //     url:"/",
    //     templateUrl:"./components/login.html",
    //     controller:"loginCtrl"
    // })
    .state("home",{
        abstract:true,
        resolve:{
                  check:function ($location,$cookies){
                        if(!($cookies.get("token"))){
                            $location.path("/login");
                        }
                    }
                },
        url:"/",
        templateUrl:"./components/home.html",
        controller:"dashboardCtrl"
    }).state("home.dashboard",{
        url:"",
        templateUrl:"./components/dashboard.html",
        
    }).state("home.metrics",{
        url:"/metrics",
        templateUrl:"./components/metrics.html"
    })
    $urlRouterProvider.otherwise("/");
})

