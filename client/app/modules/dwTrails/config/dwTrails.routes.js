'use strict';
angular.module('com.module.dwTrails')
    .config(function($stateProvider) {
      $stateProvider

              .state('app.dwTrails', {
                abstract: true,
                url: '/DwTrails',
                //templateUrl: 'modules/dwTrails/views/main.html'
                templateUrl: 'modules/dwTrails/views/main'
              })
              .state('app.dwTrails.view', {
                url: '/view/:id',
                templateUrl: 'modules/dwTrails/views/view.html',
                controller: 'DwTrailsCtrl',
                authenticate: false
              })
              .state('app.dwTrails.edit', {
                url: '/edit/:id',
                //templateUrl: 'modules/dwTrails/views/form.html',
                templateUrl: 'modules/dwTrails/views/form',
                controller: 'DwTrailsCtrl',
                authenticate: true
              })
              .state('app.dwTrails.delete', {
                url: '/delete/:id',
                controller: 'DwTrailsCtrl',
                authenticate: true
              })
              .state('app.dwTrails.list', {
                  url: '',
                  //templateUrl: 'modules/dwTrails/views/list.html',
                  templateUrl: 'modules/dwTrails/views/list',
                  controller: 'DwTrailsCtrl',
                  authenticate: true
              })
              .state('app.dwTrails.add', {
                  url: '/add',
                  //templateUrl: 'modules/dwTrails/views/form.html',
                  templateUrl: 'modules/dwTrails/views/form',
                  controller: 'DwTrailsCtrl',
                  authenticate: true
              });
    });
