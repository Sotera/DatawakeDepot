'use strict';
angular.module('com.module.dwTrails')
    .run(function ($rootScope, gettextCatalog, DwTrail) {
        $rootScope.addMenu(gettextCatalog.getString('Datawake Trails'), 'app.dwTrails.list','fa-user');

        DwTrail.find(function(data) {
            $rootScope.addDashboardBox(gettextCatalog.getString('Datawake Trails'), 'bg-red', 'ion-clipboard', data.length, 'app.dwTrails.list');
        });
    });
