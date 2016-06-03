'use strict';
var app = angular.module('com.module.dwSettings');

app.config(function($stateProvider) {
  $stateProvider.state('app.dwSettings', {
    abstract: true,
    url: '/dwSettings',
    templateUrl: 'modules/dwSettings/views/main'
  }).state('app.dwSettings.list', {
    url: '',
    templateUrl: 'modules/dwSettings/views/list',
    controller: 'DwSettingsCtrl'
  }).state('app.dwSettings.add', {
    url: '/add',
    templateUrl: 'modules/dwSettings/views/form',
    controller: 'DwSettingsCtrl'
  }).state('app.dwSettings.edit', {
    url: '/:id/edit',
    templateUrl: 'modules/dwSettings/views/form',
    controller: 'DwSettingsCtrl'
  }).state('app.dwSettings.view', {
    url: '/:id',
    templateUrl: 'modules/dwSettings/views/view',
    controller: 'DwSettingsCtrl'
  });
});
