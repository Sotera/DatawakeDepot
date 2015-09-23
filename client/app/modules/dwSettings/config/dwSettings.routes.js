'use strict';
angular.module('com.module.dwSettings')
    .config(function($stateProvider) {
      $stateProvider

          .state('app.dwSettings', {
            abstract: true,
            url: '/DwSettings',
            //templateUrl: 'modules/dwSettings/views/main.html'
            templateUrl: 'modules/dwSettings/views/main'
          })
          .state('app.dwSettings.view', {
            url: '/view/:id',
            templateUrl: 'modules/dwSettings/views/view.html',
            controller: 'DwSettingsCtrl',
            authenticate: false
          })
          .state('app.dwSettings.edit', {
              url: '/edit/:id',
              //templateUrl: 'modules/dwSettings/views/form.html',
              templateUrl: 'modules/dwSettings/views/form',
              controller: 'DwSettingsCtrl',
              authenticate: true
          })
          .state('app.dwSettings.delete', {
              url: '/delete/:id',
              controller: 'DwSettingsCtrl',
              authenticate: true
          })
          .state('app.dwSettings.list', {
              url: '',
              //templateUrl: 'modules/dwSettings/views/list.html',
              templateUrl: 'modules/dwSettings/views/list',
              controller: 'DwSettingsCtrl',
              authenticate: true
          })
          .state('app.dwSettings.add', {
              url: '/add',
              //templateUrl: 'modules/dwSettings/views/form.html',
              templateUrl: 'modules/dwSettings/views/form',
              controller: 'DwSettingsCtrl',
              authenticate: true
          });
    });
