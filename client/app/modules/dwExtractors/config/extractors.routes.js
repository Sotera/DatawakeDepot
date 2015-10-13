'use strict';
var app = angular.module('com.module.dwExtractors');

app.config(function($stateProvider) {
    $stateProvider.state('app.dwExtractors', {
        abstract: true,
        url: '/dwExtractors',
        templateUrl: 'modules/dwExtractors/views/main'
    }).state('app.dwExtractors.list', {
        url: '',
        templateUrl: 'modules/dwExtractors/views/list',
        controller: 'ExtractorsCtrl'
    }).state('app.dwExtractors.add', {
        url: '/add',
        templateUrl: 'modules/dwExtractors/views/form',
        controller: 'ExtractorsCtrl'
    }).state('app.dwExtractors.edit', {
        url: '/:id/edit',
        templateUrl: 'modules/dwExtractors/views/form',
        controller: 'ExtractorsCtrl'
    }).state('app.dwExtractors.view', {
        url: '/:id',
        templateUrl: 'modules/dwExtractors/views/view',
        controller: 'ExtractorsCtrl'
    });
});
