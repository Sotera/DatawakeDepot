'use strict';
angular.module('com.module.dwDomainItems')
    .run(function ($rootScope, gettextCatalog, DwDomainItem) {
      $rootScope.addMenu(gettextCatalog.getString('Domain Items'), 'app.dwDomainItems.list','fa-cog');

      DwDomainItem.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('Datawake Domain Items'), 'bg-blue', 'ion-clipboard', data.length, 'app.dwDomainItems.list');
      });
    });
