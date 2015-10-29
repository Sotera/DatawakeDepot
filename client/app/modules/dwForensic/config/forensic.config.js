'use strict';
var app = angular.module('com.module.dwForensic');

app.run(function($rootScope, DwTrail, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Forensic'), 'app.dwForensic.list', 'fa-sellsy');

    DwTrail.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('Forensic'), 'bg-blue4', 'fa-sellsy', data.length, 'app.dwForensic.list');
    });

});
