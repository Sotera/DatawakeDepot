'use strict';
var app = angular.module('com.module.dwTransmissions');

app.run(function($rootScope, DwTransmission, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Transmissions'), 'app.dwTransmissions.list', 'fa-navicon');

    //DwTransmission.find(function(data) {
    //    $rootScope.addDashboardBox(gettextCatalog.getString('Transmissions'), 'bg-blue6', 'ion-navicon-round', data.length, 'app.dwTransmissions.list');
    //});

});
