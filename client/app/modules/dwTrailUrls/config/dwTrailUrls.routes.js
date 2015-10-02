'use strict';
angular.module('com.module.dwTrailUrls')
    .config(function($stateProvider) {
      $stateProvider

              .state('app.dwTrailUrls', {
                abstract: true,
                url: '/DwTrailUrls',
                //templateUrl: 'modules/dwTrailUrls/views/main.html'
                templateUrl: 'modules/dwTrailUrls/views/main'
              })
              .state('app.dwTrailUrls.view', {
                url: '/view/:id',
                templateUrl: 'modules/dwTrailUrls/views/view.html',
                controller: 'DwTrailUrlsCtrl',
                authenticate: false
              })
              .state('app.dwTrailUrls.edit', {
                url: '/edit/:id',
                //templateUrl: 'modules/dwTrailUrls/views/form.html',
                templateUrl: 'modules/dwTrailUrls/views/form',
                controller: 'DwTrailUrlsCtrl',
                authenticate: true
              })
              .state('app.dwTrailUrls.delete', {
                url: '/delete/:id',
                controller: 'DwTrailUrlsCtrl',
                authenticate: true
              })
              .state('app.dwTrailUrls.list', {
                  url: '',
                  //templateUrl: 'modules/dwTrailUrls/views/list.html',
                  templateUrl: 'modules/dwTrailUrls/views/list',
                  controller: 'DwTrailUrlsCtrl',
                  authenticate: true
              })
              .state('app.dwTrailUrls.add', {
                  url: '/add',
                  //templateUrl: 'modules/dwTrailUrls/views/form.html',
                  templateUrl: 'modules/dwTrailUrls/views/form',
                  controller: 'DwTrailUrlsCtrl',
                  authenticate: true
              });
    });
