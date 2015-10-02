'use strict';
angular.module('com.module.dwUrlExtractions')
    .run(function ($rootScope, gettextCatalog, DwUrlExtraction) {
        $rootScope.addMenu(gettextCatalog.getString('Url Extractions'), 'app.dwUrlExtractions.list','fa-cog');

        DwUrlExtraction.find(function(data) {
            $rootScope.addDashboardBox(gettextCatalog.getString('Datawake Trail Url Extractions'), 'bg-gray', 'ion-clipboard', data.length, 'app.dwUrlExtractions.list');
        });
    });
