'use strict';
angular.module('com.module.dwTrails')
    .run(function ($rootScope, gettextCatalog) {
      $rootScope.addMenu(gettextCatalog.getString('Datawake Trails'), 'app.dwTrails.list','fa-user');
    });
