'use strict';
angular.module('com.module.settings')
  .config(function($stateProvider) {
    $stateProvider.state('app.settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/settings/views/main'
      })
      .state('app.settings.list', {
        url: '',
        templateUrl: 'modules/settings/views/list',
        controller: 'SettingsCtrl'
      })
      .state('app.settings.add', {
        url: '/add',
        templateUrl: 'modules/settings/views/form',
        controller: 'SettingsCtrl'
      })
      .state('app.settings.edit', {
        url: '/:id/edit',
        templateUrl: 'modules/settings/views/form',
        controller: 'SettingsCtrl'
      })
      .state('app.settings.view', {
        url: '/:id',
        templateUrl: 'modules/settings/views/view',
        controller: 'SettingsCtrl'
      });
  });
