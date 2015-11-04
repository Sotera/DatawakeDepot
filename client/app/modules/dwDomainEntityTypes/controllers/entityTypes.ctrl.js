'use strict';
var app = angular.module('com.module.dwDomainEntityTypes');

app.controller('EntityTypesCtrl', function($scope, $state, $stateParams, DwDomain, DwDomainEntityType, EntityTypesService, gettextCatalog, AppAuth) {

  //Put the currentUser in $scope for convenience
  $scope.currentUser = AppAuth.currentUser;
  $scope.domains = [];

  $scope.entityType = {};
  $scope.formFields = [{
      key: 'id',
      type: 'input',
      templateOptions: {
          label: gettextCatalog.getString('id'),
          disabled: true
    }
  },{
    key: 'name',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Name'),
      required: true
    }
  }, {
    key: 'description',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Description'),
      required: false
    }
  }, {
      key: 'dwDomainId',
      type: 'select',
      templateOptions: {
          label: gettextCatalog.getString('Domain'),
          options: $scope.domains,
          valueProp: 'id',
          labelProp: 'name',
          required: true,
          disabled: false
      }
  }];

  $scope.delete = function(id) {
    EntityTypesService.deleteEntityType(id, function() {
      $scope.safeDisplayedentityTypes = EntityTypesService.getEntityTypes();
      $state.go('^.list');
    });
  };

  $scope.onSubmit = function() {
    EntityTypesService.upsertEntityType($scope.entityType, function() {
      $scope.safeDisplayedentityTypes = EntityTypesService.getEntityTypes();
      $state.go('^.list');
    });
  };

  $scope.entityTypes = EntityTypesService.getEntityTypes();

  $scope.loading = true;
  DwDomainEntityType.find({filter: {include: ['domain','domainItems']}}).$promise
      .then(function (allEntityTypes) {
          $scope.safeDisplayedentityTypes = allEntityTypes;
          $scope.displayedEntityTypes = [].concat($scope.safeDisplayedentityTypes);
      })
      .catch(function (err) {
          console.log(err);
      })
      .then(function () {
          $scope.loading = false;
      });

  DwDomain.find({filter: {include: []}}).$promise
      .then(function (allDomains) {
          for (var i = 0; i < allDomains.length; ++i) {
               $scope.domains.push({
                    value: allDomains[i].name,
                    name: allDomains[i].name + " - " + allDomains[i].description,
                    id: allDomains[i].id
               });
          }
      })
      .catch(function (err) {
          console.log(err);
      })
      .then(function () {
      }
  );

  if ($stateParams.id) {
      $scope.loading = true;
      DwDomainEntityType.findOne({
          filter: {
              where: {
                  id: $stateParams.id
              },
              include: ['domain','domainItems']
          }
      }).$promise
          .then(function (domain) {
              $scope.entityType = domain;
          });
      $scope.loading = false;
  } else {
      $scope.entityType = {};
  }

  $scope.getDomains = function () {
    return [];
  }

});

