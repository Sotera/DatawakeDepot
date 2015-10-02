'use strict';
angular.module('com.module.dwTrailUrls')
    .run(function ($rootScope, gettextCatalog, DwTrailUrl) {
        $rootScope.addMenu(gettextCatalog.getString('Trail Urls'), 'app.dwTrailUrls.list','fa-cog');

        DwTrailUrl.find(function(data) {
            $rootScope.addDashboardBox(gettextCatalog.getString('Datawake Trail Urls'), 'bg-brown', 'ion-clipboard', data.length, 'app.dwTrailUrls.list');
        });
    });
