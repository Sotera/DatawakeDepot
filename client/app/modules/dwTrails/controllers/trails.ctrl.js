'use strict';
var app = angular.module('com.module.dwTrails');

app.controller('TrailsCtrl', function($scope, $state, $stateParams, DwDomain, DwTrail, TrailsService, gettextCatalog, AppAuth) {

  //Put the currentUser in $scope for convenience
  $scope.currentUser = AppAuth.currentUser;
  $scope.domains = [];

  $scope.trail = {};
  $scope.formFields = [{
      key: 'id',
      type: 'input',
      templateOptions: {
          label: gettextCatalog.getString('id'),
          disabled: true
      }
  },{
    key: 'name',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Name'),
      required: true
    }
  }, {
    key: 'description',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Description'),
      required: false
    }
  }, {
      key: 'timestamp',
      type: 'input',
      templateOptions: {
          label: gettextCatalog.getString('Timestamp'),
          disabled: true,
          required: false
    }
  }, {
      key: 'domainId',
      type: 'select',
      templateOptions: {
          label: gettextCatalog.getString('Domain'),
          options: $scope.domains,
          valueProp: 'id',
          labelProp: 'name',
          required: true,
          disabled: false
      }
  }, {
      key: 'teamId',
      type: 'input',
      templateOptions: {
          label: gettextCatalog.getString('Team'),
          required: false,
          disabled: true
      }
  }, {
      key: 'userId',
      type: 'input',
      templateOptions: {
          label: gettextCatalog.getString('Created By'),
          required: false,
          disabled: true
      }
  }];

  $scope.delete = function(id) {
    TrailsService.deleteTrail(id, function() {
      $scope.safeDisplayedtrails = TrailsService.getTrails();
      $state.go('^.list');
    });
  };

  $scope.onSubmit = function() {
    TrailsService.upsertTrail($scope.trail, function() {
      $scope.safeDisplayedtrails = TrailsService.getTrails();
      $state.go('^.list');
    });
  };

  $scope.loading = true;
  DwTrail.find({filter: {include: ['domain','team','user','urls']}}).$promise
      .then(function (allTrails) {
          $scope.safeDisplayedtrails = allTrails;
          $scope.displayedTrails = [].concat($scope.safeDisplayedtrails);
      })
      .catch(function (err) {
          console.log(err);
      })
      .then(function () {
          $scope.loading = false;
      }
  );

  DwDomain.find({filter: {include: []}}).$promise
      .then(function (allDomains) {
          for (var i = 0; i < allDomains.length; ++i) {
              $scope.domains.push({
                  value: allDomains[i].name,
                  name: allDomains[i].description,
                  id: allDomains[i].id
              });
          }
      })
      .catch(function (err) {
          console.log(err);
      })
      .then(function () {
      }
  );

  if ($stateParams.id) {
      TrailsService.getTrail($stateParams.id).$promise.then(function(result){
          $scope.trail = result;})
  } else {
      $scope.trail = {};
  }

});

