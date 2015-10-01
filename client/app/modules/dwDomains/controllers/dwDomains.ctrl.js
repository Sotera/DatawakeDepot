'use strict';
var app = angular.module('com.module.dwDomains');
app.controller('DwDomainsCtrl', function ($scope, $stateParams, $state, CoreService, DwDomain, AppAuth, gettextCatalog) {


  //Setup formly fields for add & edit routes
  $scope.formFields = [{
    key: 'domain',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Domain Name'),
      type: 'input',
      required: true,
      disabled: false
    }
  }, {
    key: 'value',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Domain Value'),
      type: 'input',
      required: true
    }
  }];

  //if $stateParams.id is defined we will be editing an existing dwDomain.
  //Otherwise creating a new dwDomain
  if ($stateParams.id) {
    DwDomain.findOne({
      filter: {
        where: {
          id: $stateParams.id
        }
      }
    }, function (result) {
      $scope.dwDomain = result;
    }, function (err) {
      console.log(err);
    });
  }

  $scope.delete = function (id) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
        gettextCatalog.getString('Deleting this cannot be undone'),
        function () {
          DwDomain.deleteById(id, function () {
                CoreService.toastSuccess(gettextCatalog.getString(
                    'Domain deleted'), gettextCatalog.getString(
                    'Your Domain is deleted!'));
                $state.go('app.dwDomains.list');
              },
              function (err) {
                CoreService.toastError(gettextCatalog.getString(
                    'Error deleting Domain'), gettextCatalog.getString(
                    'Your Domain is not deleted:' + err));
              });
        },
        function () {
          return false;
        });
  };

  $scope.loading = true;
  DwDomain.find({filter:{}}).$promise
      .then(function(allDomains){
        $scope.safeDisplayedDomains = allDomains;
        $scope.displayedDomains = [].concat($scope.safeDisplayedDomains);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function(){
        $scope.loading = false;
      });
  return;

  $scope.safeDisplayedDomains = DwDomain.find({
    filter: {
      include: []
    }
  }, function () {
    $scope.loading = false;
  });

  $scope.displayedDomains = [].concat($scope.safeDisplayedDomains);
  $scope.onSubmit = function () {
    DwDomain.upsert($scope.dwDomain, function () {
      CoreService.toastSuccess(gettextCatalog.getString('Domain saved'),
          gettextCatalog.getString('This Domain is saved!'));
      $state.go('^.list');
    }, function (err) {
      CoreService.toastError(gettextCatalog.getString(
          'Error saving Domain: ', +err));
    });
  };
  return;

});
