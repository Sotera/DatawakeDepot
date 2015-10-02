'use strict';
angular.module('com.module.dwDomainEntityTypes')
    .config(function($stateProvider) {
      $stateProvider

          .state('app.dwDomainEntityTypes', {
            abstract: true,
            url: '/DwDomainEntityTypes',
            //templateUrl: 'modules/dwDomainEntityTypes/views/main.html'
            templateUrl: 'modules/dwDomainEntityTypes/views/main'
          })
          .state('app.dwDomainEntityTypes.view', {
            url: '/views/:id',
            templateUrl: 'modules/dwDomainEntityTypes/views/views',
            controller: 'DwDomainEntityTypesCtrl',
            authenticate: false
          })
          .state('app.dwDomainEntityTypes.edit', {
              url: '/edit/:id',
              //templateUrl: 'modules/dwDomainEntityTypes/views/form.html',
              templateUrl: 'modules/dwDomainEntityTypes/views/form',
              controller: 'DwDomainEntityTypesCtrl',
              authenticate: true
          })
          .state('app.dwDomainEntityTypes.delete', {
              url: '/delete/:id',
              controller: 'DwDomainEntityTypesCtrl',
              authenticate: true
          })
          .state('app.dwDomainEntityTypes.list', {
              url: '',
              //templateUrl: 'modules/dwDomainEntityTypes/views/list.html',
              templateUrl: 'modules/dwDomainEntityTypes/views/list',
              controller: 'DwDomainEntityTypesCtrl',
              authenticate: true
          })
          .state('app.dwDomainEntityTypes.add', {
              url: '/add',
              //templateUrl: 'modules/dwDomainEntityTypes/views/form.html',
              templateUrl: 'modules/dwDomainEntityTypes/views/form',
              controller: 'DwDomainEntityTypesCtrl',
              authenticate: true
          });
    });
