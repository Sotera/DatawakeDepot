'use strict';
angular.module('com.module.dwCrawlTypes')
    .config(function($stateProvider) {
      $stateProvider

          .state('app.dwCrawlTypes', {
            abstract: true,
            url: '/DwCrawlTypes',
            //templateUrl: 'modules/dwCrawlTypes/views/main.html'
            templateUrl: 'modules/dwCrawlTypes/views/main'
          })
          .state('app.dwCrawlTypes.view', {
            url: '/views/:id',
            templateUrl: 'modules/dwCrawlTypes/views/views',
            controller: 'DwCrawlTypesCtrl',
            authenticate: false
          })
          .state('app.dwCrawlTypes.edit', {
              url: '/edit/:id',
              //templateUrl: 'modules/dwCrawlTypes/views/form.html',
              templateUrl: 'modules/dwCrawlTypes/views/form',
              controller: 'DwCrawlTypesCtrl',
              authenticate: true
          })
          .state('app.dwCrawlTypes.delete', {
              url: '/delete/:id',
              controller: 'DwCrawlTypesCtrl',
              authenticate: true
          })
          .state('app.dwCrawlTypes.list', {
              url: '',
              //templateUrl: 'modules/dwCrawlTypes/views/list.html',
              templateUrl: 'modules/dwCrawlTypes/views/list',
              controller: 'DwCrawlTypesCtrl',
              authenticate: true
          })
          .state('app.dwCrawlTypes.add', {
              url: '/add',
              //templateUrl: 'modules/dwCrawlTypes/views/form.html',
              templateUrl: 'modules/dwCrawlTypes/views/form',
              controller: 'DwCrawlTypesCtrl',
              authenticate: true
          });
    });
