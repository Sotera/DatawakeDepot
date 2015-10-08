'use strict';
var app = angular.module('com.module.dwDomains');

app.run(function($rootScope, DwDomain, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Datawake Domains'), 'app.domains.list', 'fa-file-o');

    DwDomain.find(function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('Datawake Domains'),'bg-green', 'ion-clipboard', data.length, 'app.domains.list');
    });

});
