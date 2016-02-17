'use strict';
var app = angular.module('com.module.dwDomainEntityTypes');

app.config(function($stateProvider) {
  $stateProvider.state('app.dwDomainEntityTypes', {
    abstract: true,
    url: '/dwDomainEntityTypes',
    templateUrl: 'modules/dwDomainEntityTypes/views/main'
  }).state('app.dwDomainEntityTypes.list', {
    url: '/list/:domainId',
    templateUrl: 'modules/dwDomainEntityTypes/views/list',
    controller: 'EntityTypesCtrl'
  }).state('app.dwDomainEntityTypes.add', {
    url: '/add/:domainId',
    templateUrl: 'modules/dwDomainEntityTypes/views/form',
    controller: 'EntityTypesCtrl'
  }).state('app.dwDomainEntityTypes.edit', {
    url: '/edit/:id/:domainId',
    templateUrl: 'modules/dwDomainEntityTypes/views/form',
    controller: 'EntityTypesCtrl'
  }).state('app.dwDomainEntityTypes.view', {
    url: '/view/:id/:domainId',
    templateUrl: 'modules/dwDomainEntityTypes/views/view',
    controller: 'EntityTypesCtrl'
  });
});
