'use strict';
angular.module('com.module.dwDomainEntityTypes')
    .run(function ($rootScope, gettextCatalog, DwDomainEntityType) {
      $rootScope.addMenu(gettextCatalog.getString('Domain Entity Types'), 'app.dwDomainEntityTypes.list','fa-cog');

      DwDomainEntityType.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('Datawake Domain Entity Types'), 'bg-black', 'ion-clipboard', data.length, 'app.dwDomainEntityTypes.list');
      });
    });
