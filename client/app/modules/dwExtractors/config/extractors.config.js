'use strict';
var app = angular.module('com.module.dwExtractors');

app.run(function($rootScope, DwExtractor, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Extractors'), 'app.dwExtractors.list', 'fa-cog');

    DwExtractor.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('Extractors'), 'bg-blue', 'ion-clipboard', data.length, 'app.dwExtractors.list');
    });

});
