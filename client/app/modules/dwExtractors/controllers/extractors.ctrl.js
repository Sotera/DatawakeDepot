'use strict';
var app = angular.module('com.module.dwExtractors');

app.controller('ExtractorsCtrl', function($scope, $state, $stateParams, ExtractorsService, gettextCatalog, AppAuth) {

    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;

    $scope.extractor = {};
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
        key: 'index',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Index'),
            required: false
        }
    }, {
        key: 'extractorUrl',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Url'),
            required: true
        }
    }, {
        key: 'credentials',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Credentials'),
            required: false
        }
    }, {
        key: 'protocol',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Protocol'),
            required: false
        }
    }, {
        key: 'serviceTypeId',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('ServiceType'),
            required: false
        }
    }];


    $scope.delete = function(id) {
        ExtractorsService.deleteExtractor(id, function() {
            $scope.extractors = ExtractorsService.getExtractors();
            $state.go('^.list');
        });
    };

    $scope.onSubmit = function() {
        ExtractorsService.upsertExtractor($scope.extractor, function() {
            $scope.extractors = ExtractorsService.getExtractors();
            $state.go('^.list');
        });
    };

    $scope.extractors = ExtractorsService.getExtractors();

    if ($stateParams.id) {
        ExtractorsService.getExtractor($stateParams.id).$promise.then(function(result){
            $scope.extractor = result;})
    } else {
        $scope.extractor = {};
    }

    $scope.getDomains = function () {
        return [];
    }

});

