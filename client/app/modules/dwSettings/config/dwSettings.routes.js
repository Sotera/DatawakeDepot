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
            controller: 'dwSettingsCtrl',
            authenticate: false
          });
    });
