'use strict';
angular.module('com.module.dwServiceTypes')
    .run(function ($rootScope, gettextCatalog, DwServiceType) {
        $rootScope.addMenu(gettextCatalog.getString('Datawake Service Types'), 'app.dwServiceTypes.list','fa-user');

        DwServiceType.find(function(data) {
            $rootScope.addDashboardBox(gettextCatalog.getString('Datawake Service Types'), 'bg-orange', 'ion-clipboard', data.length, 'app.dwServiceTypes.list');
        });
    });
