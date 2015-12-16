'use strict';
var app = angular.module('com.module.dwUrlExtractions');

app.config(function($stateProvider) {
    $stateProvider.state('app.dwUrlExtractions', {
        abstract: true,
        url: '/dwUrlExtractions',
        templateUrl: 'modules/dwUrlExtractions/views/main'
    }).state('app.dwUrlExtractions.add', {
        url: '/add/:trailUrlId',
        templateUrl: 'modules/dwUrlExtractions/views/form',
        controller: 'UrlExtractionsCtrl'
    }).state('app.dwUrlExtractions.list', {
        url: '/list/:trailUrlId',
        templateUrl: 'modules/dwUrlExtractions/views/list',
        controller: 'UrlExtractionsCtrl'
    }).state('app.dwUrlExtractions.edit', {
        url: '/edit/:id/:trailUrlId',
        templateUrl: 'modules/dwUrlExtractions/views/form',
        controller: 'UrlExtractionsCtrl'
    }).state('app.dwUrlExtractions.view', {
        url: '/view/:id',
        templateUrl: 'modules/dwUrlExtractions/views/view',
        controller: 'UrlExtractionsCtrl'
    });
});
