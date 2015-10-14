'use strict';
var app = angular.module('com.module.dwDomains');

app.run(function($rootScope, DwDomain, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Domains'), 'app.dwDomains.list', 'fa-cog');

    DwDomain.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('Domains'), 'bg-blue', 'ion-ios-color-filter-outline', data.length, 'app.dwDomains.list');
    });

});
