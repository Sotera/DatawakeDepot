'use strict';
var app = angular.module('com.module.dwCrawlTypes');
app.controller('DwCrawlTypesCtrl', function ($scope, $stateParams, $state, CoreService, DwCrawlType, AppAuth, gettextCatalog) {


  //Setup formly fields for add & edit routes
  $scope.formFields = [{
    key: 'name',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Crawl Type Name'),
      type: 'input',
      required: true,
      disabled: false
    }
  }, {
    key: 'description',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Crawl Type Value'),
      type: 'input',
      required: true
    }
  }];

  //if $stateParams.id is defined we will be editing an existing dwCrawlType.
  //Otherwise creating a new dwCrawlType
  if ($stateParams.id) {
    DwCrawlType.findOne({
      filter: {
        where: {
          id: $stateParams.id
        }
      }
    }, function (result) {
      $scope.dwCrawlType = result;
    }, function (err) {
      console.log(err);
    });
  }

  $scope.delete = function (id) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
        gettextCatalog.getString('Deleting this cannot be undone'),
        function () {
          DwCrawlType.deleteById(id, function () {
                CoreService.toastSuccess(gettextCatalog.getString(
                    'Crawl Type deleted'), gettextCatalog.getString(
                    'Your Crawl Type is deleted!'));
                $state.go('app.dwCrawlTypes.list');
              },
              function (err) {
                CoreService.toastError(gettextCatalog.getString(
                    'Error deleting Crawl Type'), gettextCatalog.getString(
                    'Your Crawl Type is not deleted:' + err));
              });
        },
        function () {
          return false;
        });
  };

  $scope.loading = true;
  DwCrawlType.find({filter:{}}).$promise
      .then(function(allCrawlTypes){
        $scope.safeDisplayedCrawlTypes = allCrawlTypes;
        $scope.displayedCrawlTypes = [].concat($scope.safeDisplayedCrawlTypes);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function(){
        $scope.loading = false;
      });
  return;

  $scope.safeDisplayedCrawlTypes = DwCrawlType.find({
    filter: {
      include: []
    }
  }, function () {
    $scope.loading = false;
  });

  $scope.displayedCrawlTypes = [].concat($scope.safeDisplayedCrawlTypes);
  $scope.onSubmit = function () {
    DwCrawlType.upsert($scope.dwCrawlType, function () {
      CoreService.toastSuccess(gettextCatalog.getString('Crawl Type saved'),
          gettextCatalog.getString('This Crawl Type is saved!'));
      $state.go('^.list');
    }, function (err) {
      CoreService.toastError(gettextCatalog.getString(
          'Error saving Crawl Type: ', +err));
    });
  };
  return;

});
