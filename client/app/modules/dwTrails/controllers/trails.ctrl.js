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
          disabled: false,
          onChange: function($viewValue){
              $scope.loadDomains($viewValue);
          }
      }
  }, {
      key: 'dwDomainId',
      type: 'select',
      expressionProperties: {
          // This watches for form changes and enables/disables the Domain dropdoawn as necessary
          'templateOptions.disabled': function () {
              return $scope.plDomains.length<=0;
          }
      },
      templateOptions: {
          label: gettextCatalog.getString('Domain'),
          options: $scope.plDomains,
          valueProp: 'id',
          labelProp: 'name',
          required: true,
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

  $scope.loadDomains = function(teamId){
      //Populate plDomains from the domains for the given teamId in plTeams
      $scope.plTeams.forEach(function (team){
          if (team.id == teamId){
              if( team.domains) {
                  for (var i = 0; i < team.domains.length; ++i) {
                      $scope.plDomains.push({
                          value: team.domains[i].name,
                          name: team.domains[i].name,
                          id: team.domains[i].id
                      });
                  }
              } else {
                  $scope.plDomains.length =0;
              }
          }
      });
  }

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

          //Admins get all teams
          if($scope.currentUser.isAdmin){
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
          } else {
              for (var i = 0; i < $scope.currentUser.teams.length; ++i) {
                $scope.plTeams.push({
                    value: $scope.currentUser.teams[i].name,
                    name: $scope.currentUser.teams[i].name,
                    id: $scope.currentUser.teams[i].id,
                    domains: $scope.currentUser.teams[i].domains
                });
              }
          }
      })
      .catch(function (err) {
          console.log(err);
      })
      .then(function () {
          $scope.loading = false;
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

