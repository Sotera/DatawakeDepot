'use strict';
var app = angular.module('com.module.dwFeeds');

app.run(function($rootScope, DwFeed, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Feeds'), 'app.dwFeeds.list', 'fa-cog');

    DwFeed.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('Feeds'), 'bg-blue', 'ion-clipboard', data.length, 'app.dwFeeds.list');
    });

});
