'use strict';
var app = angular.module('com.module.dwFeeds');

app.run(function($rootScope, DwFeed, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Feeds'), 'app.dwFeeds.list', 'fa-navicon');

    DwFeed.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('Feeds'), 'bg-blue9', 'ion-navicon-round', data.length, 'app.dwFeeds.list');
    });

});
