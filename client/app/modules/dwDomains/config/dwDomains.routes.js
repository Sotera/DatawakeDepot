'use strict';
angular.module('com.module.dwDomains')
    .config(function($stateProvider) {
      $stateProvider

          .state('app.dwDomains', {
            abstract: true,
            url: '/DwDomains',
            //templateUrl: 'modules/dwDomains/views/main.html'
            templateUrl: 'modules/dwDomains/views/main'
          })
          .state('app.dwDomains.view', {
            url: '/views/:id',
            templateUrl: 'modules/dwDomains/views/views',
            controller: 'DwDomainsCtrl',
            authenticate: false
          })
          .state('app.dwDomains.edit', {
              url: '/edit/:id',
              //templateUrl: 'modules/dwDomains/views/form.html',
              templateUrl: 'modules/dwDomains/views/form',
              controller: 'DwDomainsCtrl'
              //,
              //authenticate: true
          })
          .state('app.dwDomains.delete', {
              url: '/delete/:id',
              controller: 'DwDomainsCtrl',
              authenticate: true
          })
          .state('app.dwDomains.list', {
              url: '',
              //templateUrl: 'modules/dwDomains/views/list.html',
              templateUrl: 'modules/dwDomains/views/list',
              controller: 'DwDomainsCtrl',
              authenticate: true
          })
          .state('app.dwDomains.add', {
              url: '/add',
              //templateUrl: 'modules/dwDomains/views/form.html',
              templateUrl: 'modules/dwDomains/views/form',
              controller: 'DwDomainsCtrl'
              //,
              //authenticate: true
          });
    });
