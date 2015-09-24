'use strict';
var app = angular.module('com.module.dwTrails');
app.controller('DwTrailsCtrl', function ($scope, $stateParams, $state, CoreService, DwTrail, AppAuth, gettextCatalog) {

  //Put the currentTrail in $scope for convenience
  //$scope.currentUser = AppAuth.currentUser;

  //Setup formly fields for add & edit routes
  $scope.formFields = [{
    key: 'name',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Trail Name'),
      type: 'input',
      required: true,
      disabled: false
    }
  }, {
    key: 'description',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Trail Description'),
      type: 'input',
      required: true
    }
  }];

  //if $stateParams.id is defined we will be editing an existing trail.
  //Otherwise creating a new trail
  if ($stateParams.id) {
    DwTrail.findOne({
      filter: {
        where: {
          id: $stateParams.id
        }
      }
    }, function (result) {
      $scope.trail = result;
    }, function (err) {
      console.log(err);
    });
  }

  $scope.delete = function (id) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
        gettextCatalog.getString('Deleting this cannot be undone'),
        function () {
          DwTrail.deleteById(id, function () {
                CoreService.toastSuccess(gettextCatalog.getString(
                    'Trail deleted'), gettextCatalog.getString(
                    'Your trail is deleted!'));
                $state.go('app.dwTrails.list');
              },
              function (err) {
                CoreService.toastError(gettextCatalog.getString(
                    'Error deleting trail'), gettextCatalog.getString(
                    'Your trail is not deleted:' + err));
              });
        },
        function () {
          return false;
        });
  };

  $scope.loading = true;
  DwTrail.find({filter:{}}).$promise
      .then(function(allTrails){
        $scope.safeDisplayedTrails = allTrails;
        $scope.displayedTails = [].concat($scope.safeDisplayedTrails);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function(){
        $scope.loading = false;
      });
  return;

  $scope.safeDisplayedTrails = Trail.find({
    filter: {
      include: []
    }
  }, function () {
    $scope.loading = false;
  });

  $scope.displayedTrails = [].concat($scope.safeDisplayedTrails);
  $scope.onSubmit = function () {
    Trail.upsert($scope.trail, function () {
      CoreService.toastSuccess(gettextCatalog.getString('Trail saved'),
          gettextCatalog.getString('This trail is saved!'));
      $state.go('^.list');
    }, function (err) {
      CoreService.toastError(gettextCatalog.getString(
          'Error saving trail: ', +err));
    });
  };
  return;

  ////Dual list management for Roles/Teams
  ////http://www.bootply.com/mRcBel7RWm
  //var userData = [
  //  {id: 1, firstName: 'Mary', lastName: 'Goodman', approved: true, points: 34},
  //  {id: 2, firstName: 'Mark', lastName: 'Wilson', approved: true, points: 4},
  //  {id: 3, firstName: 'Alex', lastName: 'Davies', approved: true, points: 56},
  //  {id: 4, firstName: 'Bob', lastName: 'Banks', approved: false, points: 14},
  //  {id: 5, firstName: 'David', lastName: 'Stevens', approved: false, points: 100},
  //  {id: 6, firstName: 'Jason', lastName: 'Durham', approved: false, points: 0},
  //  {id: 7, firstName: 'Jeff', lastName: 'Marks', approved: true, points: 8},
  //  {id: 8, firstName: 'Betty', lastName: 'Abercrombie', approved: true, points: 18},
  //  {id: 9, firstName: 'Krista', lastName: 'Michaelson', approved: true, points: 10},
  //  {id: 11, firstName: 'Devin', lastName: 'Sumner', approved: false, points: 3},
  //  {id: 12, firstName: 'Navid', lastName: 'Palit', approved: true, points: 57},
  //  {id: 13, firstName: 'Bhat', lastName: 'Phuart', approved: false, points: 314},
  //  {id: 14, firstName: 'Nuper', lastName: 'Galzona', approved: true, points: 94}
  //];
  //
  //$scope.selectedA = [];
  //$scope.selectedB = [];
  //$scope.listA = userData.slice(0, 5);
  //$scope.listB = userData.slice(6, 10);
  //$scope.items = userData;
  //$scope.checkedA = false;
  //$scope.checkedB = false;
  //function arrayObjectIndexOf(myArray, searchTerm, property) {
  //  for (var i = 0, len = myArray.length; i < len; i++) {
  //    if (myArray[i][property] === searchTerm) return i;
  //  }
  //  return -1;
  //}
  //
  //$scope.aToB = function () {
  //  for (var i in $scope.selectedA) {
  //    var moveId = arrayObjectIndexOf($scope.items, $scope.selectedA[i], "id");
  //    $scope.listB.push($scope.items[moveId]);
  //    var delId = arrayObjectIndexOf($scope.listA, $scope.selectedA[i], "id");
  //    $scope.listA.splice(delId, 1);
  //  }
  //  reset();
  //};
  //$scope.bToA = function () {
  //  for (var i in $scope.selectedB) {
  //    var moveId = arrayObjectIndexOf($scope.items, $scope.selectedB[i], "id");
  //    $scope.listA.push($scope.items[moveId]);
  //    var delId = arrayObjectIndexOf($scope.listB, $scope.selectedB[i], "id");
  //    $scope.listB.splice(delId, 1);
  //  }
  //  reset();
  //};
  //function reset() {
  //  $scope.selectedA = [];
  //  $scope.selectedB = [];
  //  $scope.toggle = 0;
  //}
  //
  //$scope.toggleA = function () {
  //  if ($scope.selectedA.length > 0) {
  //    $scope.selectedA = [];
  //  }
  //  else {
  //    for (var i in $scope.listA) {
  //      $scope.selectedA.push($scope.listA[i].id);
  //    }
  //  }
  //}
  //$scope.toggleB = function () {
  //  if ($scope.selectedB.length > 0) {
  //    $scope.selectedB = [];
  //  }
  //  else {
  //    for (var i in $scope.listB) {
  //      $scope.selectedB.push($scope.listB[i].id);
  //    }
  //  }
  //}
  //$scope.selectA = function (i) {
  //  $scope.selectedA.push(i);
  //};
  //$scope.selectB = function (i) {
  //  $scope.selectedB.push(i);
  //};
});
