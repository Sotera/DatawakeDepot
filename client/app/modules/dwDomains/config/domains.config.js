'use strict';
var app = angular.module('com.module.dwDomains');

app.run(function($rootScope, DwDomain, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Domains'), 'app.dwDomains.list', 'ion-ios-color-filter-outline');

    DwDomain.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('Domains'), 'bg-blue3', 'ion-ios-color-filter-outline', data.length, 'app.dwDomains.list');
    });

});
