'use strict';
var app = angular.module('com.module.dwTrailUrls');

app.controller('TrailUrlsCtrl', function($scope, $state, $stateParams, $window, DwTrail, DwTrailUrl, TrailUrlsService, gettextCatalog, AppAuth) {

    $scope.trails = [];
    $scope.currentTrailId = '';
    $scope.trailUrl = {};

    $scope.itemIndex = 0;
    $scope.itemsPerPage = 15;

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

    $scope.delete = function(trail) {
        if(trail.id){
            TrailUrlsService.deleteTrailUrl(trail, function() {
                $scope.safeDisplayedtrailUrls = TrailUrlsService.getFilteredTrailUrls($scope.currentTrailId);
                $state.go('^.list', { 'trailId': $scope.currentTrailId});
            });
        }else{
            $state.go('^.list', { 'trailId': $scope.currentTrailId});
        }
    };

    $scope.onSubmit = function() {
        TrailUrlsService.upsertTrailUrl($scope.trailUrl, function() {
            $scope.safeDisplayedtrailUrls = TrailUrlsService.getFilteredTrailUrls($scope.currentTrailId);
            $state.go('^.list', { 'trailId': $scope.currentTrailId});
        });
    };

    $scope.openUrl = function(trailUrl){
        $window.open(trailUrl.url);
    };

    $scope.loadPicklists = function () {
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

    $scope.setPageButtons = function(resultLen){
        var pageState =  '';
        var fwd = false;
        var back = false;

        //figure out if we have more than one page of results to see if we enable Fwd
        if(resultLen >= $scope.itemsPerPage){
            fwd = true;
        }
        //figure out if we're on page greater than page 1 to enable Back
        if($scope.itemIndex >= $scope.itemsPerPage){
            back = true;
        }
        if(fwd && back){
            pageState = 'both';
        }else if (!fwd && back){
            pageState = 'backwardOnly';
        }else if (fwd && !back){
            pageState = 'forwardOnly';
        }

        switch (pageState){
            case 'forwardOnly':
                $('#pageBack').attr('disabled', 'disabled');
                $('#pageFwd').removeAttr('disabled');
                break;
            case 'backwardOnly':
                $('#pageFwd').attr('disabled', 'disabled');
                $('#pageBack').removeAttr('disabled');
                break;
            case 'both':
                $('#pageBack').removeAttr('disabled');
                $('#pageFwd').removeAttr('disabled');
                break;
            default: //disabled
                $('#pageBack').attr('disabled', 'disabled');
                $('#pageFwd').attr('disabled', 'disabled');
        }
    };

    $scope.nextPage = function(){
        $scope.itemIndex = $scope.itemIndex + $scope.itemsPerPage;
        $scope.getFilteredPagedResults($scope.currentTrailId, $scope.itemIndex,  $scope.itemsPerPage);
    };

    $scope.prevPage = function(){
        $scope.itemIndex = $scope.itemIndex - $scope.itemsPerPage;
        $scope.getFilteredPagedResults($scope.currentTrailId, $scope.itemIndex,  $scope.itemsPerPage);
    };

    $scope.getFilteredPagedResults = function(trailId, itemIndex, itemsPer) {
        $scope.loading = true;
        TrailUrlsService.getFilteredPagedTrailUrls(trailId, itemIndex, itemsPer).$promise.then(function (result) {
            $scope.currentTrailId = trailId;
            $scope.trailUrl = {};
            $scope.safeDisplayedtrailUrls = result;
            $scope.displayedTrailUrls = [].concat($scope.safeDisplayedtrailUrls);

            $scope.setPageButtons(result.length);
            $scope.loading = false;
        });
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
            $scope.getFilteredPagedResults($stateParams.trailId, $scope.itemIndex, $scope.itemsPerPage);
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

