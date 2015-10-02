'use strict';
var app = angular.module('com.module.dwUrlExtractions');
app.controller('DwUrlExtractionsCtrl', function ($scope, $stateParams, $state, CoreService, DwUrlExtraction, AppAuth, gettextCatalog) {

  //Put the current UrlExtraction in $scope for convenience
  //$scope.currentUser = AppAuth.currentUser;
  //Setup formly fields for add & edit routes
  $scope.formFields = [{
    key: 'name',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Url Extraction Name'),
      type: 'input',
      required: true,
      disabled: false
    }
  }, {
    key: 'description',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Url Extraction Description'),
      type: 'input',
      required: true
    }
  }];
  //if $stateParams.id is defined we will be editing an existing UrlExtraction.
  //Otherwise creating a new UrlExtraction
  if ($stateParams.id) {
    DwUrlExtraction.findOne({
      filter: {
        where: {
          id: $stateParams.id
        }
      }
    }, function (result) {
      $scope.UrlExtraction = result;
    }, function (err) {
      console.log(err);
    });
  }
  $scope.delete = function (id) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function () {
        DwUrlExtraction.deleteById(id, function () {
            CoreService.toastSuccess(gettextCatalog.getString(
              'Trail deleted'), gettextCatalog.getString(
              'Your Url Extraction is deleted!'));
            $state.go('app.dwUrlExtractions.list');
          },
          function (err) {
            CoreService.toastError(gettextCatalog.getString(
              'Error deleting Url Extraction'), gettextCatalog.getString(
              'Your Url Extraction is not deleted:' + err));
          });
      },
      function () {
        return false;
      });
  };
  $scope.loading = true;
  DwUrlExtraction.find({filter: {}}).$promise
    .then(function (allUrlExtractions) {
      $scope.safeDisplayedUrlExtractions = allUrlExtractions;
      $scope.displayedTails = [].concat($scope.safeDisplayedUrlExtractions);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      $scope.loading = false;
    });
  $scope.onSubmit = function () {
    DwUrlExtraction.upsert($scope.UrlExtraction).$promise
      .then(function () {
        CoreService.toastSuccess(gettextCatalog.getString('Url Extraction saved'),
          gettextCatalog.getString('This Url Extraction is saved!'));
        $state.go('^.list');
      })
      .catch(function (err) {
        CoreService.toastError('Error saving Url Extraction: ' + err);
      });
  };
});
