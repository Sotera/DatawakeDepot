'use strict';
var app = angular.module('com.module.dwDomainItems');

app.run(function($rootScope, DwDomainItem, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Domain Items'), 'app.dwDomainItems.list', 'fa-th');

    //DwDomainItem.find(function(data) {
    //    $rootScope.addDashboardBox(gettextCatalog.getString('Domain Items'), 'bg-blue2', 'ion-ios-keypad', data.length, 'app.dwDomainItems.list');
    //});

});
