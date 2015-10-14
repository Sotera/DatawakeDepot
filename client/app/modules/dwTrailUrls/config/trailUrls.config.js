'use strict';
var app = angular.module('com.module.dwTrailUrls');

app.run(function($rootScope, DwTrailUrl, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('TrailUrls'), 'app.dwTrailUrls.list', 'fa-cog');

    DwTrailUrl.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('TrailUrls'), 'bg-blue', 'ion-social-buffer', data.length, 'app.dwTrailUrls.list');
    });

});
