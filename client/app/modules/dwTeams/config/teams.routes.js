'use strict';
var app = angular.module('com.module.dwTeams');

app.config(function($stateProvider) {
  $stateProvider.state('app.dwTeams', {
    abstract: true,
    url: '/dwTeams',
    templateUrl: 'modules/dwTeams/views/main'
  }).state('app.dwTeams.list', {
    url: '',
    templateUrl: 'modules/dwTeams/views/list',
    controller: 'TeamsCtrl'
  }).state('app.dwTeams.add', {
    url: '/add',
    templateUrl: 'modules/dwTeams/views/form',
    controller: 'TeamsCtrl'
  }).state('app.dwTeams.edit', {
    url: '/:id/edit',
    templateUrl: 'modules/dwTeams/views/form',
    controller: 'TeamsCtrl'
  }).state('app.dwTeams.view', {
    url: '/:id',
    templateUrl: 'modules/dwTeams/views/view',
    controller: 'TeamsCtrl'
  });
});
