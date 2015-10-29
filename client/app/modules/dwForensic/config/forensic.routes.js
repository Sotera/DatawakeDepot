'use strict';
var app = angular.module('com.module.dwForensic');

app.config(function($stateProvider) {
    $stateProvider.state('app.dwForensic', {
        abstract: true,
        url: '/dwForensic',
        templateUrl: 'modules/dwForensic/views/main.html'
    }).state('app.dwForensic.list', {
        url: '',
        templateUrl: 'modules/dwForensic/views/list.html',
        controller: 'ForensicCtrl'
    });
});