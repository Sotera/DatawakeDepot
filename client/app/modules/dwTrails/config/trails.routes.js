'use strict';
var app = angular.module('com.module.dwTrails');

app.config(function($stateProvider) {
  $stateProvider.state('app.dwTrails', {
    abstract: true,
    url: '/dwTrails',
    templateUrl: 'modules/dwTrails/views/main'
  }).state('app.dwTrails.upload', {
    url: '/upload',
    templateUrl: 'modules/dwTrails/views/upload',
    controller: 'TrailsCtrl'
  }).state('app.dwTrails.import', {
    url: '/import',
    templateUrl: 'modules/dwTrails/views/import',
    controller: 'TrailsCtrl'
  }).state('app.dwTrails.list', {
    url: '',
    templateUrl: 'modules/dwTrails/views/list',
    controller: 'TrailsCtrl'
  }).state('app.dwTrails.add', {
    url: '/add',
    templateUrl: 'modules/dwTrails/views/form',
    controller: 'TrailsCtrl'
  }).state('app.dwTrails.edit', {
    url: '/:id/edit',
    templateUrl: 'modules/dwTrails/views/form',
    controller: 'TrailsCtrl'
  }).state('app.dwTrails.view', {
    url: '/:id',
    templateUrl: 'modules/dwTrails/views/view',
    controller: 'TrailsCtrl'
  });
});
