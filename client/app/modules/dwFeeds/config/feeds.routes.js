'use strict';
var app = angular.module('com.module.dwFeeds');

app.config(function($stateProvider) {
    $stateProvider.state('app.dwFeeds', {
        abstract: true,
        url: '/dwFeeds',
        templateUrl: 'modules/dwFeeds/views/main'
    }).state('app.dwFeeds.list', {
        url: '',
        templateUrl: 'modules/dwFeeds/views/list',
        controller: 'FeedsCtrl'
    }).state('app.dwFeeds.add', {
        url: '/add',
        templateUrl: 'modules/dwFeeds/views/form',
        controller: 'FeedsCtrl'
    }).state('app.dwFeeds.edit', {
        url: '/:id/edit',
        templateUrl: 'modules/dwFeeds/views/form',
        controller: 'FeedsCtrl'
    }).state('app.dwFeeds.view', {
        url: '/:id',
        templateUrl: 'modules/dwFeeds/views/view',
        controller: 'FeedsCtrl'
    });
});
