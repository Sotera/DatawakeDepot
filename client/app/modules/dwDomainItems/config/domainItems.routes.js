'use strict';
var app = angular.module('com.module.dwDomainItems');

app.config(function($stateProvider) {
    $stateProvider.state('app.dwDomainItems', {
        abstract: true,
        url: '/dwDomainItems',
        templateUrl: 'modules/dwDomainItems/views/main'
    }).state('app.dwDomainItems.list', {
        url: '/list/:domainId',
        templateUrl: 'modules/dwDomainItems/views/list',
        controller: 'DomainItemsCtrl'
    }).state('app.dwDomainItems.add', {
        url: '/add/:domainId',
        templateUrl: 'modules/dwDomainItems/views/form',
        controller: 'DomainItemsCtrl'
    }).state('app.dwDomainItems.edit', {
        url: '/edit/:id/:domainId',
        templateUrl: 'modules/dwDomainItems/views/form',
        controller: 'DomainItemsCtrl'
    }).state('app.dwDomainItems.view', {
        url: '/view/:id/:domainId',
        templateUrl: 'modules/dwDomainItems/views/view',
        controller: 'DomainItemsCtrl'
    });
});
