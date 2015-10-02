'use strict';
var app = angular.module('com.module.dwDomainItems');
app.controller('DwDomainItemsCtrl', function ($scope, $stateParams, $state, CoreService, DwDomainItem, AppAuth, gettextCatalog) {


  //Setup formly fields for add & edit routes
  $scope.formFields = [{
    key: 'domainItem',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('DomainItem Name'),
      type: 'input',
      required: true,
      disabled: false
    }
  }, {
    key: 'value',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('DomainItem Value'),
      type: 'input',
      required: true
    }
  }];

  //if $stateParams.id is defined we will be editing an existing dwDomainItem.
  //Otherwise creating a new dwDomainItem
  if ($stateParams.id) {
    DwDomainItem.findOne({
      filter: {
        where: {
          id: $stateParams.id
        }
      }
    }, function (result) {
      $scope.dwDomainItem = result;
    }, function (err) {
      console.log(err);
    });
  }

  $scope.delete = function (id) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
        gettextCatalog.getString('Deleting this cannot be undone'),
        function () {
          DwDomainItem.deleteById(id, function () {
                CoreService.toastSuccess(gettextCatalog.getString(
                    'Domain Item deleted'), gettextCatalog.getString(
                    'Your Domain Item is deleted!'));
                $state.go('app.dwDomain Items.list');
              },
              function (err) {
                CoreService.toastError(gettextCatalog.getString(
                    'Error deleting Domain Item'), gettextCatalog.getString(
                    'Your Domain Item is not deleted:' + err));
              });
        },
        function () {
          return false;
        });
  };

  $scope.loading = true;
  DwDomainItem.find({filter:{}}).$promise
      .then(function(allDomainItems){
        $scope.safeDisplayedDomainItems = allDomainItems;
        $scope.displayedDomainItems = [].concat($scope.safeDisplayedDomainItems);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function(){
        $scope.loading = false;
      });
  return;

  $scope.safeDisplayedDomainItems = DwDomainItem.find({
    filter: {
      include: []
    }
  }, function () {
    $scope.loading = false;
  });

  $scope.displayedDomainItems = [].concat($scope.safeDisplayedDomainItems);
  $scope.onSubmit = function () {
    DwDomainItem.upsert($scope.dwDomainItem, function () {
      CoreService.toastSuccess(gettextCatalog.getString('Domain Item saved'),
          gettextCatalog.getString('This Domain Item is saved!'));
      $state.go('^.list');
    }, function (err) {
      CoreService.toastError(gettextCatalog.getString(
          'Error saving Domain Item: ', +err));
    });
  };
  return;

});
