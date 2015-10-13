'use strict';
var app = angular.module('com.module.dwCrawlTypes');

app.config(function($stateProvider) {
    $stateProvider.state('app.dwCrawlTypes', {
        abstract: true,
        url: '/dwCrawlTypes',
        templateUrl: 'modules/dwCrawlTypes/views/main'
    }).state('app.dwCrawlTypes.list', {
        url: '',
        templateUrl: 'modules/dwCrawlTypes/views/list',
        controller: 'CrawlTypesCtrl'
    }).state('app.dwCrawlTypes.add', {
        url: '/add',
        templateUrl: 'modules/dwCrawlTypes/views/form',
        controller: 'CrawlTypesCtrl'
    }).state('app.dwCrawlTypes.edit', {
        url: '/:id/edit',
        templateUrl: 'modules/dwCrawlTypes/views/form',
        controller: 'CrawlTypesCtrl'
    }).state('app.dwCrawlTypes.view', {
        url: '/:id',
        templateUrl: 'modules/dwCrawlTypes/views/view',
        controller: 'CrawlTypesCtrl'
    });
});
