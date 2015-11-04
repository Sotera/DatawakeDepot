'use strict';
var app = angular.module('com.module.dwDomains');

app.config(function($stateProvider) {
    $stateProvider.state('app.dwDomains', {
        abstract: true,
        url: '/dwDomains',
        templateUrl: 'modules/dwDomains/views/main'
    }).state('app.dwDomains.upload', {
        url: '/upload',
        templateUrl: 'modules/dwDomains/views/upload',
        controller: 'DomainsCtrl'
    }).state('app.dwDomains.import', {
        url: '/import',
        templateUrl: 'modules/dwDomains/views/import',
        controller: 'DomainsCtrl'
    }).state('app.dwDomains.list', {
        url: '',
        templateUrl: 'modules/dwDomains/views/list',
        controller: 'DomainsCtrl'
    }).state('app.dwDomains.add', {
        url: '/add',
        templateUrl: 'modules/dwDomains/views/form',
        controller: 'DomainsCtrl'
    }).state('app.dwDomains.edit', {
        url: '/:id/edit',
        templateUrl: 'modules/dwDomains/views/form',
        controller: 'DomainsCtrl'
    }).state('app.dwDomains.view', {
        url: '/:id',
        templateUrl: 'modules/dwDomains/views/view',
        controller: 'DomainsCtrl'
    });
});
