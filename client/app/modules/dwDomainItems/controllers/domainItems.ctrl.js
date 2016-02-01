'use strict';
var app = angular.module('com.module.dwDomainItems');

app.controller('DomainItemsCtrl', function($scope, $state, $stateParams, DwDomain, DomainItemsService, gettextCatalog, AppAuth) {
    $scope.domains = [];
    $scope.currentDomainId= '';
    $scope.domainItem = {};

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
        key: 'dwDomainId',
        type: 'select',
        templateOptions: {
            label: gettextCatalog.getString('Domain'),
            options: $scope.domains,
            valueProp: 'id',
            labelProp: 'name',
            required: true
        }
        ,
        expressionProperties:{
            'templateOptions.disabled': 'model.id'
        }
    },{
        key: 'itemValue',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Value'),
            required: true
        }
    },{
        key: 'coreItem',
        type: 'checkbox',
        templateOptions: {
            label: gettextCatalog.getString('Core Item?'),
            required: false
        }
    }];

    $scope.delete = function(domainItem) {
        if(domainItem.id){
            DomainItemsService.deleteDomainItem(domainItem, function() {
                $scope.safeDisplayeddomainItems = DomainItemsService.getFilteredDomainItems($scope.currentDomainId);
                $state.go('^.list');
            });
        }else{
            $state.go('^.list');
        }
    };

    $scope.onSubmit = function() {
        DomainItemsService.upsertDomainItem($scope.domainItem, function() {
            $scope.safeDisplayeddomainItems = DomainItemsService.getFilteredDomainItems($scope.currentDomainId);
            $state.go('^.list');
        });
    };

    $scope.loadPicklists = function () {
        DwDomain.find({filter: {include: []}}).$promise
            .then(function (allDomains) {
                $scope.domains.length=0;
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
        $scope.getFilteredPagedResults($scope.currentDomainId, $scope.itemIndex,  $scope.itemsPerPage);
    };

    $scope.prevPage = function(){
        $scope.itemIndex = $scope.itemIndex - $scope.itemsPerPage;
        $scope.getFilteredPagedResults($scope.currentDomainId, $scope.itemIndex,  $scope.itemsPerPage);
    };

    $scope.getFilteredPagedResults = function(domainId, itemIndex, itemsPer) {
        $scope.loading = true;

        DomainItemsService.getFilteredPagedDomainItems(domainId, itemIndex, itemsPer).$promise.then(function(result){
            $scope.currentDomainId = domainId;
            $scope.domainItem = {};
            $scope.safeDisplayeddomainItems = result;
            $scope.displayedDomainItems = [].concat($scope.displayedDomainItems);

            $scope.setPageButtons(result.length);
            $scope.loading = false;
        });
    };

    $scope.loading = true;
    AppAuth.getCurrentUser().then(function (currUser) {
        $scope.currentUser = currUser;
        $scope.loadPicklists(currUser);
        if ($stateParams.id && $stateParams.domainId) {
            DomainItemsService.getDomainItem($stateParams.id).$promise.then(function(result) {
                $scope.currentDomainId = $stateParams.domainId;
                $scope.domainItem = result;
                $scope.safeDisplayeddomainItems = {};
                $scope.displayedDomainItems = {};
                $scope.loading = false;
            })
        } else if ($stateParams.domainId){
            $scope.getFilteredPagedResults($stateParams.domainId, $scope.itemIndex, $scope.itemsPerPage);
        } else {
            DomainItemsService.getDomainItems().$promise.then(function(result){
                $scope.currentDomainId = '';
                $scope.domainItem = {};
                $scope.safeDisplayeddomainItems = result;
                $scope.displayedDomainItems = [].concat($scope.displayedDomainItems);
                $scope.loading = false;
            });
        }
    }, function (err) {
        console.log(err);
    });
});

