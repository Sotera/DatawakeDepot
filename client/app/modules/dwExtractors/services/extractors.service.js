'use strict';
var app = angular.module('com.module.dwExtractors');

app.service('ExtractorsService', ['$state', 'CoreService', 'DwExtractor', 'gettextCatalog', function($state, CoreService, DwExtractor, gettextCatalog) {

  this.getExtractors = function() {
    return DwExtractor.find();
  };

  this.getExtractor = function(id) {
    return DwExtractor.findById({
      id: id
    });
  };

  this.upsertExtractor = function(extractor, cb) {
    DwExtractor.upsert(extractor, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
          'Extractor saved'), gettextCatalog.getString(
          'Your extractor is safe with us!'));
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
          'Error saving extractor '), gettextCatalog.getString(
              'This extractor could no be saved: ') + err);
    });
  };

  this.deleteExtractor = function(id, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
        gettextCatalog.getString('Deleting this cannot be undone'),
        function() {
          DwExtractor.deleteById(id, function() {
            CoreService.toastSuccess(gettextCatalog.getString(
                'Extractor deleted'), gettextCatalog.getString(
                'Your extractor is deleted!'));
            cb();
          }, function(err) {
            CoreService.toastError(gettextCatalog.getString(
                'Error deleting extractor'), gettextCatalog.getString(
                    'Your extractor is not deleted! ') + err);
          });
        },
        function() {
          return false;
        });
  };

}]);
