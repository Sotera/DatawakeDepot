'use strict';
angular.module('com.module.dwUrlExtractions')
    .config(function($stateProvider) {
      $stateProvider

              .state('app.dwUrlExtractions', {
                abstract: true,
                url: '/DwUrlExtractions',
                //templateUrl: 'modules/dwUrlExtractions/views/main.html'
                templateUrl: 'modules/dwUrlExtractions/views/main'
              })
              .state('app.dwUrlExtractions.view', {
                url: '/view/:id',
                templateUrl: 'modules/dwUrlExtractions/views/view.html',
                controller: 'DwUrlExtractionsCtrl',
                authenticate: false
              })
              .state('app.dwUrlExtractions.edit', {
                url: '/edit/:id',
                //templateUrl: 'modules/dwUrlExtractions/views/form.html',
                templateUrl: 'modules/dwUrlExtractions/views/form',
                controller: 'DwUrlExtractionsCtrl',
                authenticate: true
              })
              .state('app.dwUrlExtractions.delete', {
                url: '/delete/:id',
                controller: 'DwUrlExtractionsCtrl',
                authenticate: true
              })
              .state('app.dwUrlExtractions.list', {
                  url: '',
                  //templateUrl: 'modules/dwUrlExtractions/views/list.html',
                  templateUrl: 'modules/dwUrlExtractions/views/list',
                  controller: 'DwUrlExtractionsCtrl',
                  authenticate: true
              })
              .state('app.dwUrlExtractions.add', {
                  url: '/add',
                  //templateUrl: 'modules/dwUrlExtractions/views/form.html',
                  templateUrl: 'modules/dwUrlExtractions/views/form',
                  controller: 'DwUrlExtractionsCtrl',
                  authenticate: true
              });
    });
