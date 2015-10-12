'use strict';
var app = angular.module('com.module.dwUrlExtractions');

app.config(function($stateProvider) {
    $stateProvider.state('app.dwUrlExtractions', {
        abstract: true,
        url: '/dwUrlExtractions',
        templateUrl: 'modules/dwUrlExtractions/views/main'
    }).state('app.dwUrlExtractions.list', {
        url: '',
        templateUrl: 'modules/dwUrlExtractions/views/list',
        controller: 'UrlExtractionsCtrl'
    }).state('app.dwUrlExtractions.add', {
        url: '/add',
        templateUrl: 'modules/dwUrlExtractions/views/form',
        controller: 'UrlExtractionsCtrl'
    }).state('app.dwUrlExtractions.edit', {
        url: '/:id/edit',
        templateUrl: 'modules/dwUrlExtractions/views/form',
        controller: 'UrlExtractionsCtrl'
    }).state('app.dwUrlExtractions.view', {
        url: '/:id',
        templateUrl: 'modules/dwUrlExtractions/views/view',
        controller: 'UrlExtractionsCtrl'
    });
});
