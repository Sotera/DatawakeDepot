'use strict';
angular.module('com.module.dwSettings')
    .run(function ($rootScope, gettextCatalog, DwSetting) {
        $rootScope.addMenu(gettextCatalog.getString('Settings'), 'app.dwSettings.list','fa-cog');

        DwSetting.find(function(data) {
            $rootScope.addDashboardBox(gettextCatalog.getString('Datawake Settings'), 'bg-purple', 'ion-clipboard', data.length, 'app.dwSettings.list');
        });
    });
