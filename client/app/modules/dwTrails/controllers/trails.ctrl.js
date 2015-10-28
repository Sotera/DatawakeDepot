'use strict';
var app = angular.module('com.module.dwTrails');

app.controller('TrailsCtrl', function($scope, $state, $stateParams, DwDomain, DwTeam, DwFeed, AminoUser, DwTrail, TrailsService, gettextCatalog, AppAuth) {

  //Put the currentUser in $scope for convenience
  $scope.currentUser = AppAuth.currentUser;
  $scope.plDomains = [];
  $scope.plTeams = [];
  $scope.plScrapeTypes = [{value:"URL"},{value:"Body"}];
  $scope.plUsers = [];
  $scope.plFeeds = [];

  $scope.trail = {};
  $scope.formFields = [{
      key: 'id',
      type: 'input',
      templateOptions: {
          label: gettextCatalog.getString('id'),
          disabled: true
      }
  }, {
      key: 'dwTeamId',
      type: 'select',
      templateOptions: {
          label: gettextCatalog.getString('Team'),
          options: $scope.plTeams,
          valueProp: 'id',
          labelProp: 'name',
          required: true,
          disabled: false
      }
  }, {
      key: 'dwDomainId',
      type: 'select',
      templateOptions: {
          label: gettextCatalog.getString('Domain'),
          options: $scope.plDomains,
          valueProp: 'id',
          labelProp: 'name',
          required: true,
          disabled: false
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
          options: $scope.plScrapeTypes,
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
      key: 'AminoUsers',
      type: 'multiCheckbox',
      templateOptions: {
          label: 'Users',
          options: $scope.plUsers,
          valueProp: 'id',
          //labelProp: 'username',
          required: false,
          disabled: false
      }
  }, {
      key: 'dwFeeds',
      type: 'multiCheckbox',
      templateOptions: {
          label: 'Feeds',
          options: $scope.plFeeds,
          valueProp: 'id',
          required: false,
          disabled: false
      }
  }];

  $scope.delete = function(trail) {
    TrailsService.deleteTrail(trail, function() {
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
  DwTrail.find({filter: {include: ['domain','team','users','trailUrls','feeds']}}).$promise
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
              $scope.plDomains.push({
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
              $scope.plTeams.push({
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

  DwFeed.find({filter: {include: []}}).$promise
      .then(function (allFeeds) {
          for (var i = 0; i < allFeeds.length; ++i) {
              $scope.plFeeds.push({
                  value: allFeeds[i].id,
                  name: allFeeds[i].name,
                  id: allFeeds[i].id
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
              $scope.plUsers.push({
                  value: allUsers[i].id,
                  name: allUsers[i].username,
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

