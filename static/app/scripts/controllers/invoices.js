
angular.module('Invoicing')
  .factory('ShowAlert', ['$alert', function($alert) {
    return {
      error: function (title, content) {
        window.console.error(title+': '+content);
        $alert({title: title,
                content: content,
                placement: 'top',
                duration: 60,
                keyboard: true,
                container: '.main',
                type: 'danger',
                show: true});
      },
      success: function (title, content) {
        $alert({title: title,
                content: content,
                placement: 'top',
                duration: 20,
                keyboard: true,
                container: '.main',
                type: 'success',
                show: true});
      },
      info: function (title, content) {
        $alert({title: title,
                content: content,
                duration: 20,
                keyboard: true,
                placement: 'top',
                container: '.main',
                type: 'info',
                show: true});
      }
    };
  }])

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
        $scope.add_product = function() {

        }
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

            $scope.monthly_labels = [].concat.apply([], Object.keys(data.monthly).map(y => Object.keys(data.monthly[y]).map(m => y+'-'+m) ));
            $scope.monthly_data = [ [].concat.apply([], Object.keys(data.monthly).map(y => Object.keys(data.monthly[y]).map(m => data.monthly[y][m]) )) ];

            $scope.quarterly_labels = [].concat.apply([], Object.keys(data.quarterly).map(y => Object.keys(data.quarterly[y]).map(q => y+'-'+q) ));
            $scope.quarterly_data = [ [].concat.apply([], Object.keys(data.quarterly).map(y => Object.keys(data.quarterly[y]).map(q => data.quarterly[y][q]) )) ];

            window.results = $scope.results;
        });
    }])


