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
    DwExtractor.upsert(extractor, function(newExtractor) {
      CoreService.toastSuccess(gettextCatalog.getString('Extractor saved'), gettextCatalog.getString('Your extractor is safe with us!'));

      //TODO: We must first remove all linked items before adding them, otherwise we can't account for removed links

      //For Many-To-Many relationships you MUST manually link the two models for INCLUDE to work in relationships
      if(extractor.dwDomains) {
          extractor.dwDomains.forEach(function (domain) {
              DwExtractor.domains.link({id: newExtractor.id, fk: domain}, null, function (value, header) {
                  //success
              });
          });
      };
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
          'Error saving extractor '), gettextCatalog.getString(
              'This extractor could no be saved: ') + err);
    });
  };

  this.deleteExtractor = function(extractor, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
        gettextCatalog.getString('Deleting this cannot be undone'),
        function() {
          DwExtractor.deleteById(extractor.id, function() {
            CoreService.toastSuccess(gettextCatalog.getString('Extractor deleted'), gettextCatalog.getString('Your extractor is deleted!'));
            //For Many-To-Many relationships you MUST manually link the two models for INCLUDE to work in relationships
            if(extractor.dwDomains) {
                extractor.dwDomains.forEach(function (domain) {
                    DwExtractor.domains.unlink({id: extractor.id, fk: domain}, null, function (value, header) {
                        //success
                    });
                });
            };
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
