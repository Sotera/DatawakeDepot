'use strict';
var app = angular.module('com.module.dwUrlExtractions');

app.run(function($rootScope, DwUrlExtraction, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('UrlExtractions'), 'app.dwUrlExtractions.list', 'fa-newspaper-o');

    //DwUrlExtraction.find(function(data) {
    //    $rootScope.addDashboardBox(gettextCatalog.getString('UrlExtractions'), 'bg-blue', 'ion-share', data.length, 'app.dwUrlExtractions.list');
    //});

});
