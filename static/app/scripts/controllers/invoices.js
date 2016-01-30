
angular.module('Invoicing')
.controller('InvoiceListCtrl', ['$scope', 'Invoice',
    function($scope, Invoice){
        $scope.invoices = Invoice.query({sort: '[("iid", -1)]'});
        $scope.loadInvoices = function(){
            var new_invoices = Invoice.query({page: $scope.page, sort: '[("iid", -1)]'}, function(data){
                if (data.length > 0){
                    for (var i = 0; i < data.length; i++){
                        $scope.invoices.push(data[i]);
                    }
                }
            });
        };
        window.$scope = $scope
        $scope.Invoice = Invoice
        $scope.loadInvoice = function(ii){
          $scope.invoice = null;
          Invoice.get({"invoiceId": ii}, function(data) {
              $scope.invoice = data;
          });
        };
        $scope.loadInvoices();
    }])

angular.module('Invoicing')
.controller('ResultsCtrl', ['$scope', 'Results',
    function($scope, Results){
      $scope.series = [''];
        $scope.yearly_labels = [''];
        $scope.quarterly_labels = [''];
        $scope.monthly_labels = [''];
        Results.get({}, function(data){
            $scope.results = data;

            $scope.yearly_labels = Object.keys(data.yearly);
            $scope.yearly_data = [ Object.keys(data.yearly).map(x => data.yearly[x]) ];

            // console.log($scope.yearly_labels);
            // console.log($scope.yearly_data);

            $scope.monthly_labels = [].concat.apply([], Object.keys(data.monthly).map(y => Object.keys(data.monthly[y]).map(m => y+'-'+m) ));
            $scope.monthly_data = [ [].concat.apply([], Object.keys(data.monthly).map(y => Object.keys(data.monthly[y]).map(m => data.monthly[y][m]) )) ];

            // console.log($scope.monthly_labels);
            // console.log($scope.monthly_data);

            $scope.quarterly_labels = [].concat.apply([], Object.keys(data.quarterly).map(y => Object.keys(data.quarterly[y]).map(q => y+'-'+q) ));
            $scope.quarterly_data = [ [].concat.apply([], Object.keys(data.quarterly).map(y => Object.keys(data.quarterly[y]).map(q => data.quarterly[y][q]) )) ];

            // console.log($scope.quarterly_labels);
            // console.log($scope.quarterly_data);

            // console.log($scope.results);
            // window.results = $scope.results;
        });
    }])
