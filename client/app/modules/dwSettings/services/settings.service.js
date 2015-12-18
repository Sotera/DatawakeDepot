'use strict';
var app = angular.module('com.module.dwSettings');

app.service('SettingsService', ['$state', 'CoreService', 'DwSetting', 'gettextCatalog', function($state, CoreService, DwSetting, gettextCatalog) {

  this.getSettings = function() {
    return DwSetting.find();
  };

  this.getSetting = function(id) {
    return DwSetting.findById({
      id: id
    });
  };

  this.upsertSetting = function(setting, cb) {
    DwSetting.upsert(setting, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Setting saved'), gettextCatalog.getString(
        'Your setting is safe with us!'));
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Error saving setting '), gettextCatalog.getString(
        'This setting could not be saved: ') + err);
    });
  };

  this.deleteSetting = function(id, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function() {
        DwSetting.deleteById(id, function() {
          CoreService.toastSuccess(gettextCatalog.getString(
            'Setting deleted'), gettextCatalog.getString(
            'Your setting is deleted!'));
          cb();
        }, function(err) {
          CoreService.toastError(gettextCatalog.getString(
            'Error deleting setting'), gettextCatalog.getString(
            'Your setting is not deleted! ') + err);
        });
      },
      function() {
        return false;
      });
  };

}]);
