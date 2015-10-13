'use strict';
var app = angular.module('com.module.dwTrailUrls');

app.run(function($rootScope, DwTrailUrl, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('TrailUrls'), 'app.dwTrailUrls.list', 'fa-cog');

    DwTrailUrl.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('TrailUrls'), 'bg-olive', 'ion-clipboard', data.length, 'app.dwTrailUrls.list');
    });

});
