'use strict';
var app = angular.module('com.module.dwForensic');

app.run(function($rootScope, DwTrail, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Forensic'), 'app.dwForensic.list');

    //DwTrail.find(function(data) {
    //    $rootScope.addDashboardBox(gettextCatalog.getString('Forensic'), 'bg-blue',  data.length, 'app.dwForensic.list');
    //});

});
