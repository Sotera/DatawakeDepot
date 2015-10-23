'use strict';
var app = angular.module('com.module.dwTransmissions');

app.config(function($stateProvider) {
    $stateProvider.state('app.dwTransmissions', {
        abstract: true,
        url: '/dwTransmissions',
        templateUrl: 'modules/dwTransmissions/views/main'
    }).state('app.dwTransmissions.list', {
        url: '',
        templateUrl: 'modules/dwTransmissions/views/list',
        controller: 'TransmissionsCtrl'
    }).state('app.dwTransmissions.add', {
        url: '/add',
        templateUrl: 'modules/dwTransmissions/views/form',
        controller: 'TransmissionsCtrl'
    }).state('app.dwTransmissions.edit', {
        url: '/:id/edit',
        templateUrl: 'modules/dwTransmissions/views/form',
        controller: 'TransmissionsCtrl'
    }).state('app.dwTransmissions.view', {
        url: '/:id',
        templateUrl: 'modules/dwTransmissions/views/view',
        controller: 'TransmissionsCtrl'
    });
});
