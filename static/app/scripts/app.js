'use strict';

/**
 * @ngdoc overview
 * @name bobackOfficeFrontApp
 * @description
 * # bobackOfficeFrontApp
 *
 * Main module of the application.
 */
angular
  .module('Invoicing', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'chart.js'
  ])

.config(function ($routeProvider) {
  $routeProvider
    .when('/404', {
      templateUrl: '404.html',
    })
    .when('/', {
      templateUrl: 'views/invoices.html',
      controller: 'InvoiceListCtrl',
      controllerAs: 'invoices'
    })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
    .otherwise({
      redirectTo: '/404'
    });
})


.factory('Invoice', ["$resource", function($resource){
    return $resource( "http://localhost:5000/invoices/:invoiceId",
        {
            invoiceId: "@iid"
        },
        {
            query: {
                method: "GET",
                isArray: true,
                transformResponse: function (data) {
                    return JSON.parse(data);
                }
            }
        });
}])

.factory('Results', ["$resource", function($resource){
    return $resource( "http://localhost:5000/results",
        {},
        {
            query: {
                method: "GET",
                isArray: true,
                transformResponse: function (data) {
                    return JSON.parse(data);
                }
            }
        });
}])

/*
.controller('InvoiceSingleSlugCtrl', ['$scope', '$location', 'Invoice', '$routeParams',
    function($scope, $location, Invoice, $routeParams){
        $scope.invoice = {};

        Invoice.query({where: {slug: $routeParams.invoiceSlug}}, , function(data){
                // Success
                $scope.invoice = data;
            }, function(error){
                // Error
                console.log(error);
                $location.path('/404');
            }
        );
    }])

.controller('ResultsCtrl', ['$scope',
    function($scope, Results){
        ;
    }])

*/
