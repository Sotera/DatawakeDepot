'use strict';
var app = angular.module('com.module.dwTrailUrls');

app.controller('TrailUrlsCtrl', function($scope, $state, $stateParams, $window, DwCrawlType, DwTrail, DwTrailUrl, TrailUrlsService, gettextCatalog, AppAuth) {

    $scope.trails = [];
    $scope.crawlTypes = [];
    $scope.currentTrailId = '';
    $scope.trailUrl = {};
    $scope.formFields = [{
        key: 'id',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('id'),
            disabled: true
        }
    }, {
        key: 'dwTrailId',
        type: 'select',
        templateOptions: {
            label: gettextCatalog.getString('Trail'),
            options: $scope.trails,
            valueProp: 'id',
            labelProp: 'name',
            required: true,
            disabled: false
        }
    },{
        key: 'url',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Url'),
            required: true
        }
    },{
        key: 'scrapedContent',
        type: 'textarea',
        templateOptions: {
            label: gettextCatalog.getString('Scraped Content')
        }
    }, {
        key: 'dwCrawlTypeId',
        type: 'select',
        templateOptions: {
            label: gettextCatalog.getString('CrawlType'),
            options: $scope.crawlTypes,
            valueProp: 'id',
            labelProp: 'name',
            required: true,
            disabled: false
        }
    }, {
        key: 'timestamp',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Timestamp'),
            required: false,
            disabled: true
        }
    }, {
        key: 'comments',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Comments'),
            disabled: false,
            required: false
        }
    }];

    $scope.delete = function(id) {
        TrailUrlsService.deleteTrailUrl(id, function() {
            $scope.safeDisplayedtrailUrls = TrailUrlsService.getFilteredTrailUrls($scope.currentTrailId);
            $state.go('^.list');
        });
    };

    $scope.onSubmit = function() {
        TrailUrlsService.upsertTrailUrl($scope.trailUrl, function() {
            $scope.safeDisplayedtrailUrls = TrailUrlsService.getFilteredTrailUrls($scope.currentTrailId);
            $state.go('^.list');
        });
    };

    $scope.openUrl = function(trailUrl){
        $window.open(trailUrl.url);
    };

    $scope.loadPicklists = function () {
        DwCrawlType.find({filter: {include: []}}).$promise
            .then(function (allCrawlTypes) {
                for (var i = 0; i < allCrawlTypes.length; ++i) {
                    $scope.crawlTypes.push({
                        value: allCrawlTypes[i].name,
                        name: allCrawlTypes[i].name + " - " + allCrawlTypes[i].description,
                        id: allCrawlTypes[i].id
                    });
                }
            })
            .catch(function (err) {
                console.log(err);
            })
            .then(function () {
            }
        );

        DwTrail.find({filter: {include: []}}).$promise
            .then(function (allTrails) {
                for (var i = 0; i < allTrails.length; ++i) {
                    $scope.trails.push({
                        value: allTrails[i].name,
                        name: allTrails[i].name + " - " + allTrails[i].description,
                        id: allTrails[i].id
                    });
                }
            })
            .catch(function (err) {
                console.log(err);
            })
            .then(function () {
            }
        );
    };

    $scope.loading = true;
    AppAuth.getCurrentUser().then(function (currUser) {
        $scope.currentUser = currUser;
        $scope.loadPicklists();
        if ($stateParams.id) {
            TrailUrlsService.getTrailUrl($stateParams.id).$promise.then(function(result) {
                $scope.currentTrailId = $stateParams.trailId;
                $scope.trailUrl = result;
                $scope.safeDisplayedTrails = {};
                $scope.displayedTrailUrls = {};
                $scope.loading = false;
            })
        } else if ($stateParams.trailId){
            TrailUrlsService.getFilteredTrailUrls($stateParams.trailId).$promise.then(function(result){
                $scope.currentTrailId = $stateParams.trailId;
                $scope.trailUrl = {};
                $scope.safeDisplayedtrailUrls = result;
                $scope.displayedTrailUrls = [].concat($scope.safeDisplayedtrailUrls);
                $scope.loading = false;
            })
        } else {
            TrailUrlsService.getTrailUrls().$promise.then(function(result){
                $scope.currentTrailId = '';
                $scope.trailUrl = {};
                $scope.safeDisplayedtrailUrls = result;
                $scope.displayedTrailUrls = [].concat($scope.safeDisplayedtrailUrls);
                $scope.loading = false;
            });
        }
    }, function (err) {
        console.log(err);
    });
});

