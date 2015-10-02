'use strict';
angular.module('com.module.dwCrawlTypes')
    .run(function ($rootScope, gettextCatalog, DwCrawlType) {
      $rootScope.addMenu(gettextCatalog.getString('Crawl Types'), 'app.dwCrawlTypes.list','fa-cog');

      DwCrawlType.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('Datawake Crawl Types'), 'bg-green', 'ion-clipboard', data.length, 'app.dwCrawlTypes.list');
      });
    });
