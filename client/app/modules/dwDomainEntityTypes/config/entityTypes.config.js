'use strict';
var app = angular.module('com.module.dwDomainEntityTypes');

app.run(function($rootScope, DwDomainEntityType, gettextCatalog) {
  $rootScope.addMenu(gettextCatalog.getString('EntityTypes'), 'app.dwDomainEntityTypes.list', 'ion-ios-information-outline');

  //DwDomainEntityType.find(function(data) {
  //  $rootScope.addDashboardBox(gettextCatalog.getString('EntityTypes'), 'bg-blue', 'ion-ios-information-outline', data.length, 'app.dwDomainEntityTypes.list');
  //});

});
