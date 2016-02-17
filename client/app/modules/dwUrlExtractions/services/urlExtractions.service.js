'use strict';
var app = angular.module('com.module.dwUrlExtractions');

app.service('UrlExtractionsService', ['$state', 'CoreService', 'DwUrlExtraction', 'gettextCatalog', function($state, CoreService, DwUrlExtraction, gettextCatalog) {

  this.getUrlExtractions = function() {
    var whereClause={
      filter:{
        order:"occurrences DESC",
        include:[
          {relation:'trailUrl',
              fields:['url'],
              scope:{include: [{relation:'trail',fields:['id','name']}]}
          }
        ]
      }
    };
    return (DwUrlExtraction.find(whereClause));
  };

  this.getUrlExtraction = function(id) {
    return DwUrlExtraction.findById({
      id: id
    });
  };

  this.getFilteredUrlExtractions = function(trailUrlId) {
    var whereClause={
        filter:{
            order:"occurrences DESC",
            where:{
                dwTrailUrlId:trailUrlId
            },
            include:[
                {relation:'trailUrl',
                    fields:['url'],
                    scope:{include: [{relation:'trail',fields:['id','name']}]}
                }
            ]
        }
    };
    return (DwUrlExtraction.find(whereClause));
  };

  this.getFilteredPagedUrlExtractions = function(trailUrlId,start,number) {
      var whereClause={
          filter:{
              limit: number,
              skip: start,
              order:"occurrences DESC",
              where:{
                  dwTrailUrlId:trailUrlId
              },
              include:[
                  {relation:'trailUrl',
                      fields:['url'],
                      scope:{include: [{relation:'trail',fields:['id','name']}]}
                  }
              ]
          }
      };
      return (DwUrlExtraction.find(whereClause));
  };


  this.upsertUrlExtraction = function(urlExtraction, cb) {
    DwUrlExtraction.upsert(urlExtraction, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
        'UrlExtraction saved'), gettextCatalog.getString(
        'Your urlExtraction is safe with us!'));
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Error saving urlExtraction '), gettextCatalog.getString(
        'This urlExtraction could not be saved: ') + err);
    });
  };

  this.deleteUrlExtraction = function(id, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function() {
        DwUrlExtraction.deleteById(id, function() {
          CoreService.toastSuccess(gettextCatalog.getString(
            'UrlExtraction deleted'), gettextCatalog.getString(
            'Your urlExtraction is deleted!'));
          cb();
        }, function(err) {
          CoreService.toastError(gettextCatalog.getString(
            'Error deleting urlExtraction'), gettextCatalog.getString(
            'Your urlExtraction is not deleted! ') + err);
        });
      },
      function() {
        return false;
      });
  };

}]);
