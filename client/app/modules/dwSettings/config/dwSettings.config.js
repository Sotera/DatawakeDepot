'use strict';
angular.module('com.module.dwSettings')
    .run(function ($rootScope, gettextCatalog) {
      $rootScope.addMenu(gettextCatalog.getString('Datawake Settings'), 'app.dwSettings.view','fa-user');
    });
