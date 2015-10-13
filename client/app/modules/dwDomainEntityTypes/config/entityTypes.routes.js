'use strict';
var app = angular.module('com.module.dwDomainEntityTypes');

app.config(function($stateProvider) {
  $stateProvider.state('app.dwDomainEntityTypes', {
    abstract: true,
    url: '/dwDomainEntityTypes',
    templateUrl: 'modules/dwDomainEntityTypes/views/main'
  }).state('app.dwDomainEntityTypes.list', {
    url: '',
    templateUrl: 'modules/dwDomainEntityTypes/views/list',
    controller: 'EntityTypesCtrl'
  }).state('app.dwDomainEntityTypes.add', {
    url: '/add',
    templateUrl: 'modules/dwDomainEntityTypes/views/form',
    controller: 'EntityTypesCtrl'
  }).state('app.dwDomainEntityTypes.edit', {
    url: '/:id/edit',
    templateUrl: 'modules/dwDomainEntityTypes/views/form',
    controller: 'EntityTypesCtrl'
  }).state('app.dwDomainEntityTypes.view', {
    url: '/:id',
    templateUrl: 'modules/dwDomainEntityTypes/views/view',
    controller: 'EntityTypesCtrl'
  });
});
