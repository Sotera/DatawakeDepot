'use strict';
var app = angular.module('com.module.dwCrawlTypes');

app.run(function($rootScope, DwCrawlType, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('CrawlTypes'), 'app.dwCrawlTypes.list', 'fa-sliders');

    //DwCrawlType.find(function(data) {
    //    $rootScope.addDashboardBox(gettextCatalog.getString('CrawlTypes'), 'bg-blue', 'ion-android-options', data.length, 'app.dwCrawlTypes.list');
    //});

});
