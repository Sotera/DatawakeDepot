'use strict';
var app = angular.module('com.module.dwServiceTypes');

app.config(function($stateProvider) {
    $stateProvider.state('app.dwServiceTypes', {
        abstract: true,
        url: '/dwServiceTypes',
        templateUrl: 'modules/dwServiceTypes/views/main'
    }).state('app.dwServiceTypes.list', {
        url: '',
        templateUrl: 'modules/dwServiceTypes/views/list',
        controller: 'ServiceTypesCtrl'
    }).state('app.dwServiceTypes.add', {
        url: '/add',
        templateUrl: 'modules/dwServiceTypes/views/form',
        controller: 'ServiceTypesCtrl'
    }).state('app.dwServiceTypes.edit', {
        url: '/:id/edit',
        templateUrl: 'modules/dwServiceTypes/views/form',
        controller: 'ServiceTypesCtrl'
    }).state('app.dwServiceTypes.view', {
        url: '/:id',
        templateUrl: 'modules/dwServiceTypes/views/view',
        controller: 'ServiceTypesCtrl'
    });
});
