'use strict';
var app = angular.module('com.module.dwUrlExtractions');

app.config(function($stateProvider) {
    $stateProvider.state('app.dwUrlExtractions', {
        abstract: true,
        url: '/dwUrlExtractions',
        templateUrl: 'modules/dwUrlExtractions/views/main'
    }).state('app.dwUrlExtractions.add', {
        url: '/add/:trailId/:trailUrlId',
        templateUrl: 'modules/dwUrlExtractions/views/form',
        controller: 'UrlExtractionsCtrl'
    }).state('app.dwUrlExtractions.list', {
        url: '/list/:trailId/:trailUrlId',
        templateUrl: 'modules/dwUrlExtractions/views/list',
        controller: 'UrlExtractionsCtrl'
    }).state('app.dwUrlExtractions.edit', {
        url: '/edit/:id/:trailId/:trailUrlId',
        templateUrl: 'modules/dwUrlExtractions/views/form',
        controller: 'UrlExtractionsCtrl'
    }).state('app.dwUrlExtractions.view', {
        url: '/view/:id/:trailId',
        templateUrl: 'modules/dwUrlExtractions/views/view',
        controller: 'UrlExtractionsCtrl'
    });
});
