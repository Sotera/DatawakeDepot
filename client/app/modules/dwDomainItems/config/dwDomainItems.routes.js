'use strict';
angular.module('com.module.dwDomainItems')
    .config(function($stateProvider) {
      $stateProvider

          .state('app.dwDomainItems', {
            abstract: true,
            url: '/DwDomainItems',
            //templateUrl: 'modules/dwDomainItems/views/main.html'
            templateUrl: 'modules/dwDomainItems/views/main'
          })
          .state('app.dwDomainItems.view', {
            url: '/views/:id',
            templateUrl: 'modules/dwDomainItems/views/views',
            controller: 'DwDomainItemsCtrl',
            authenticate: false
          })
          .state('app.dwDomainItems.edit', {
              url: '/edit/:id',
              //templateUrl: 'modules/dwDomainItems/views/form.html',
              templateUrl: 'modules/dwDomainItems/views/form',
              controller: 'DwDomainItemsCtrl',
              authenticate: true
          })
          .state('app.dwDomainItems.delete', {
              url: '/delete/:id',
              controller: 'DwDomainItemsCtrl',
              authenticate: true
          })
          .state('app.dwDomainItems.list', {
              url: '',
              //templateUrl: 'modules/dwDomainItems/views/list.html',
              templateUrl: 'modules/dwDomainItems/views/list',
              controller: 'DwDomainItemsCtrl',
              authenticate: true
          })
          .state('app.dwDomainItems.add', {
              url: '/add',
              //templateUrl: 'modules/dwDomainItems/views/form.html',
              templateUrl: 'modules/dwDomainItems/views/form',
              controller: 'DwDomainItemsCtrl',
              authenticate: true
          });
    });
