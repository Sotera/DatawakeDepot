'use strict';
var app = angular.module('com.module.dwForensic');

app.run(function($rootScope, DwTrail, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Forensic'), 'app.dwForensic.list', 'fa-search');

    DwTrail.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('Forensic'), 'bg-blue12', 'ion-ios-search-strong', data.length, 'app.dwForensic.list');
    });

});
