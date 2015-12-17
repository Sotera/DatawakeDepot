'use strict';
var app = angular.module('com.module.dwDomainEntityTypes');

app.service('EntityTypesService', ['$state', 'CoreService', 'DwDomainEntityType', 'gettextCatalog', function($state, CoreService, DwDomainEntityType, gettextCatalog) {

  this.getEntityTypes = function() {
    var whereClause={
      filter:{
        order:"name DESC",
        include:[
          'domain'
        ]
      }
    };
    return (DwDomainEntityType.find(whereClause));
  };

  this.getEntityType = function(id) {
    return DwDomainEntityType.findById({
      id: id
    });
  };

  this.getFilteredEntityTypes = function(domainId) {
    var whereClause={
      filter:{
        order:"name DESC",
        where:{
            dwDomainId:domainId
        },
        include:[
          'domain'
        ]
      }
    };
    return (DwDomainEntityType.find(whereClause));
  };


  this.upsertEntityType = function(entityType, cb) {
    DwDomainEntityType.upsert(entityType, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
        'EntityType saved'), gettextCatalog.getString(
        'Your entityType is safe with us!'));
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Error saving entityType '), gettextCatalog.getString(
        'This entityType could no be saved: ') + err);
    });
  };

  this.deleteEntityType = function(entityType, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function() {
        DwDomainEntityType.deleteById(entityType.id, function() {
          CoreService.toastSuccess(gettextCatalog.getString(
            'EntityType deleted'), gettextCatalog.getString(
            'Your entityType is deleted!'));
          cb();
        }, function(err) {
          CoreService.toastError(gettextCatalog.getString(
            'Error deleting entityType'), gettextCatalog.getString(
            'Your entityType is not deleted! ') + err);
        });
      },
      function() {
        return false;
      });
  };

}]);
