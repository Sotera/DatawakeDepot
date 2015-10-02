'use strict';
angular.module('com.module.dwDomains')
    .run(function ($rootScope, gettextCatalog, DwDomain) {
      $rootScope.addMenu(gettextCatalog.getString('Domains'), 'app.dwDomains.list','fa-cog');

      DwDomain.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('Datawake Domains'), 'bg-blue', 'ion-clipboard', data.length, 'app.dwDomains.list');
      });
    });
