'use strict';
var app = angular.module('com.module.dwTrails');

app.controller('TrailsCtrl', function($scope, $state, $stateParams, DwDomain, DwTeam, AminoUser, DwTrail, TrailsService, gettextCatalog, AppAuth) {

  //Put the currentUser in $scope for convenience
  $scope.currentUser = AppAuth.currentUser;
  $scope.domains = [];
  $scope.teams = [];
  $scope.scrapeTypes = [{value:"URL"},{value:"Body"}];
  $scope.users = [];

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
      key: 'scrape',
      type: 'select',
      templateOptions: {
          label: gettextCatalog.getString('Scrape?'),
          options: $scope.scrapeTypes,
          valueProp: 'value',
          labelProp: 'value',
          required: true,
          disabled: false
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
      key: 'dwDomainId',
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
      key: 'dwTeamId',
      type: 'multiCheckbox',
      templateOptions: {
          label: 'Teams',
          options: $scope.teams
      }
  }, {
      key: 'dwUserId',
      type: 'multiCheckbox',
      templateOptions: {
          label: 'Users',
          options: $scope.users
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
  DwTrail.find({filter: {include: ['domain','team','users','trailUrls']}}).$promise
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
                  name: allDomains[i].name,
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

  DwTeam.find({filter: {include: []}}).$promise
      .then(function (allTeams) {
          for (var i = 0; i < allTeams.length; ++i) {
              $scope.teams.push({
                  value: allTeams[i].id,
                  name: allTeams[i].name,
                  id: allTeams[i].id
              });
          }
      })
      .catch(function (err) {
          console.log(err);
      })
      .then(function () {
      }
  );

  AminoUser.find({filter: {include: []}}).$promise
      .then(function (allUsers) {
          for (var i = 0; i < allUsers.length; ++i) {
              $scope.users.push({
                  value: allUsers[i].email,
                  name: allUsers[i].firstName,
                  id: allUsers[i].id
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

