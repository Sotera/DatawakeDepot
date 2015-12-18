'use strict';
var app = angular.module('com.module.dwTransmissions');

app.service('TransmissionsService', ['$state', 'CoreService', 'DwTransmission', 'gettextCatalog', function($state, CoreService, DwTransmission, gettextCatalog) {

  this.getTransmissions = function() {
    return DwTransmission.find({filter: {include: ['feeds']}});
  };

  this.getTransmission = function(id) {
    return DwTransmission.findById({
      id: id
    });
  };

  this.upsertTransmission = function(transmission, cb) {
    DwTransmission.upsert(transmission, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
          'Transmission saved'), gettextCatalog.getString(
          'Your transmission is safe with us!'));
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
          'Error saving transmission '), gettextCatalog.getString(
              'This transmission could not be saved: ') + err);
    });
  };

  this.deleteTransmission = function(id, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
        gettextCatalog.getString('Deleting this cannot be undone'),
        function() {
          DwTransmission.deleteById(id, function() {
            CoreService.toastSuccess(gettextCatalog.getString(
                'Transmission deleted'), gettextCatalog.getString(
                'Your transmission is deleted!'));
            cb();
          }, function(err) {
            CoreService.toastError(gettextCatalog.getString(
                'Error deleting transmission'), gettextCatalog.getString(
                    'Your transmission is not deleted! ') + err);
          });
        },
        function() {
          return false;
        });
  };

}]);
