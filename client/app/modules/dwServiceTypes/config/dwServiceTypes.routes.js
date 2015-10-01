'use strict';
angular.module('com.module.dwServiceTypes')
    .config(function($stateProvider) {
        $stateProvider

            .state('app.dwServiceTypes', {
                abstract: true,
                url: '/DwServiceTypes',
                //templateUrl: 'modules/dwServiceTypes/views/main.html'
                templateUrl: 'modules/dwServiceTypes/views/main'
            })
            .state('app.dwServiceTypes.view', {
                url: '/views/:id',
                templateUrl: 'modules/dwServiceTypes/views/views',
                controller: 'DwServiceTypesCtrl',
                authenticate: false
            })
            .state('app.dwServiceTypes.edit', {
                url: '/edit/:id',
                //templateUrl: 'modules/dwServiceTypes/views/form.html',
                templateUrl: 'modules/dwServiceTypes/views/form',
                controller: 'DwServiceTypesCtrl',
                authenticate: true
            })
            .state('app.dwServiceTypes.delete', {
                url: '/delete/:id',
                controller: 'DwServiceTypesCtrl',
                authenticate: true
            })
            .state('app.dwServiceTypes.list', {
                url: '',
                //templateUrl: 'modules/dwServiceTypes/views/list.html',
                templateUrl: 'modules/dwServiceTypes/views/list',
                controller: 'DwServiceTypesCtrl',
                authenticate: true
            })
            .state('app.dwServiceTypes.add', {
                url: '/add',
                //templateUrl: 'modules/dwServiceTypes/views/form.html',
                templateUrl: 'modules/dwServiceTypes/views/form',
                controller: 'DwServiceTypesCtrl',
                authenticate: true
            });
    });
