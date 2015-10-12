'use strict';
var app = angular.module('com.module.dwTrailUrls');

app.config(function($stateProvider) {
    $stateProvider.state('app.dwTrailUrls', {
        abstract: true,
        url: '/dwTrailUrls',
        templateUrl: 'modules/dwTrailUrls/views/main'
    }).state('app.dwTrailUrls.list', {
        url: '',
        templateUrl: 'modules/dwTrailUrls/views/list',
        controller: 'TrailUrlsCtrl'
    }).state('app.dwTrailUrls.add', {
        url: '/add',
        templateUrl: 'modules/dwTrailUrls/views/form',
        controller: 'TrailUrlsCtrl'
    }).state('app.dwTrailUrls.edit', {
        url: '/:id/edit',
        templateUrl: 'modules/dwTrailUrls/views/form',
        controller: 'TrailUrlsCtrl'
    }).state('app.dwTrailUrls.view', {
        url: '/:id',
        templateUrl: 'modules/dwTrailUrls/views/view',
        controller: 'TrailUrlsCtrl'
    });
});
