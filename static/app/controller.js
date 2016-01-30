'use strict'

angular
  .module('Invoicing', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'toolTip',
    'ui.bootstrap.tpls',
    'ui.sortable',
    'ui.bootstrap.pagination'
  ])
/*

.config(function($modalProvider) {
    angular.extend($modalProvider.defaults, {
        html: true
    });
})

.config(function ($routeProvider) {
  $routeProvider
    .when('/404', {
      templateUrl: '404.html',
    })
    .when('/', {
      redirectTo: '/dashboard'
    })
    .when('/dashboard', {
      templateUrl: 'views/invoices.html',
      controller: 'InvoiceListCtrl'
    })
    .otherwise({
      redirectTo: '/404'
    });
});

.factory('Invoice', ["$resource",
    function($resource){
        return $resource("http://localhost:5000/invoices/:invoiceId",
          { invoiceId: "@iid" }, { query: {
                  method: "GET",
                  isArray: true,
                  transformResponse: function (data) {
                    return JSON.parse(data);
                  }
          }}
        );
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

.controller('InvoiceListCtrl', ['$scope', 'Invoice',
    function($scope, Invoice){
        $scope.invoices = Invoice.query({sort: '[("iid", -1)]'});
        $scope.loadInvoices = function(){
             // * Get next page from RESTful API and set callback to push these items
             // * into invoices.
            var new_invoices = Invoices.query({page: $scope.page, sort: '[("iid", -1)]'}, function(data){
                if (data.length > 0){
                    for (var i = 0; i < data.length; i++){
                        $scope.invoices.push(data[i]);
                    }
                }
            });
        };
    }])

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
