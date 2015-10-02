'use strict';
angular.module('com.module.dwTrails')
    .run(function ($rootScope, gettextCatalog, DwTrail) {
        $rootScope.addMenu(gettextCatalog.getString('Trails'), 'app.dwTrails.list','fa-cog');

        DwTrail.find(function(data) {
            $rootScope.addDashboardBox(gettextCatalog.getString('Datawake Trails'), 'bg-red', 'ion-clipboard', data.length, 'app.dwTrails.list');
        });
    });
