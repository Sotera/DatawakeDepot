'use strict';
var app = angular.module('com.module.dwTrailUrls');

app.service('TrailUrlsService', ['$state', 'CoreService', 'DwTrail','DwTrailUrl','DwUrlExtraction', 'gettextCatalog', function($state, CoreService, DwTrail, DwTrailUrl,DwUrlExtraction, gettextCatalog) {

  this.getTrailUrls = function() {
    var whereClause={
        filter:{
            order:"url DESC",
            include:[
                'trail',
                'crawlType',
                {relation:'urlExtractions',scope:{fields: ['id']}}
            ]
        }
    };
    return (DwTrailUrl.find(whereClause));
  };

  this.getTrailUrl = function(id) {
    return DwTrailUrl.findById({
      id: id
    });
  };

  this.getFilteredTrailUrls = function(trailId) {
    var whereClause={
        filter:{
            order:"url DESC",
            where:{
                dwTrailId:trailId
            },
            include:[
                'trail',
                'crawlType',
                {relation:'urlExtractions',scope:{fields: ['id']}}
            ]
        }
    };
    return (DwTrailUrl.find(whereClause));
  };

  this.upsertTrailUrl = function(trailUrl, cb) {
    DwTrailUrl.upsert(trailUrl, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
        'TrailUrl saved'), gettextCatalog.getString(
        'Your trailUrl is safe with us!'));
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Error saving trailUrl '), gettextCatalog.getString(
        'This trailUrl could no be saved: ') + err);
    });
  };

  this.deleteTrailUrl = function(url, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),gettextCatalog.getString('Deleting this cannot be undone'),
      function() {
        DwTrailUrl.deleteById(url.id, function() {CoreService.toastSuccess(gettextCatalog.getString('TrailUrl deleted'), gettextCatalog.getString('Your trailUrl is deleted!'));
            if(url.id.urlExtractions) {
                url.id.urlExtractions.forEach(function (ex) {
                    DwUrlExtraction.delete(ex, function () {
                        //success
                    }, function (err) {
                    });
                });
            }
            cb();
        }, function(err) {
          CoreService.toastError(gettextCatalog.getString(
            'Error deleting trailUrl'), gettextCatalog.getString(
            'Your trailUrl is not deleted! ') + err);
        });
      },
      function() {
        return false;
      });
  };

}]);
