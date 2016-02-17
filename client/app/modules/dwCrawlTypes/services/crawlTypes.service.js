'use strict';
var app = angular.module('com.module.dwCrawlTypes');

app.service('CrawlTypesService', ['$state', 'CoreService', 'DwCrawlType', 'gettextCatalog', function($state, CoreService, DwCrawlType, gettextCatalog) {

  this.getCrawlTypes = function() {
    return DwCrawlType.find();
  };

  this.getCrawlType = function(id) {
    return DwCrawlType.findById({
      id: id
    });
  };

  this.upsertCrawlType = function(crawlType, cb) {
    DwCrawlType.upsert(crawlType, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
        'CrawlType saved'), gettextCatalog.getString(
        'Your crawlType is safe with us!'));
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Error saving crawlType '), gettextCatalog.getString(
        'This crawlType could not be saved: ') + err);
    });
  };

  this.deleteCrawlType = function(id, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function() {
        DwCrawlType.deleteById(id, function() {
          CoreService.toastSuccess(gettextCatalog.getString(
            'CrawlType deleted'), gettextCatalog.getString(
            'Your crawlType is deleted!'));
          cb();
        }, function(err) {
          CoreService.toastError(gettextCatalog.getString(
            'Error deleting crawlType'), gettextCatalog.getString(
            'Your crawlType is not deleted! ') + err);
        });
      },
      function() {
        return false;
      });
  };

}]);
