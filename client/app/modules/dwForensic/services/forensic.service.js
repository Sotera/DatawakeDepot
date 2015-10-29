'use strict';
var app = angular.module('com.module.dwForensic');

app.service('ForensicService', ['$state', 'CoreService', 'DwTrail', 'gettextCatalog', function($state, CoreService, DwTrail, gettextCatalog) {

  this.getTrails = function() {
    return DwTrail.find();
  };

  this.getTrail = function(id) {
    return DwTrail.findById({
      id: id
    });
  };

}]);
