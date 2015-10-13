'use strict';
var app = angular.module('com.module.dwServiceTypes');

app.service('ServiceTypesService', ['$state', 'CoreService', 'DwServiceType', 'gettextCatalog', function($state, CoreService, DwServiceType, gettextCatalog) {

  this.getServiceTypes = function() {
    return DwServiceType.find();
  };

  this.getServiceType = function(id) {
    return DwServiceType.findById({
      id: id
    });
  };

  this.upsertServiceType = function(serviceType, cb) {
    DwServiceType.upsert(serviceType, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
          'ServiceType saved'), gettextCatalog.getString(
          'Your serviceType is safe with us!'));
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
          'Error saving serviceType '), gettextCatalog.getString(
              'This serviceType could no be saved: ') + err);
    });
  };

  this.deleteServiceType = function(id, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
        gettextCatalog.getString('Deleting this cannot be undone'),
        function() {
          DwServiceType.deleteById(id, function() {
            CoreService.toastSuccess(gettextCatalog.getString(
                'ServiceType deleted'), gettextCatalog.getString(
                'Your serviceType is deleted!'));
            cb();
          }, function(err) {
            CoreService.toastError(gettextCatalog.getString(
                'Error deleting serviceType'), gettextCatalog.getString(
                    'Your serviceType is not deleted! ') + err);
          });
        },
        function() {
          return false;
        });
  };

}]);
