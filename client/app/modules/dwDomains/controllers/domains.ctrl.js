'use strict';
var app = angular.module('com.module.dwDomains');

app.controller('DomainsCtrl', function($scope, $state, $http, $stateParams, FileUploader, DwTeam, DwExtractor, CoreService,
                                       DomainsService, gettextCatalog, AppAuth, lodash) {
    $scope.plExtractors = [];
    $scope.plTeams=[];

    $scope.itemIndex = 0;
    $scope.itemsPerPage = 15;

    $scope.formFields = [{
        key: 'id',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Id'),
            disabled: true
        }
    }, {key: 'name',
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
            required: true
        }
    }, {
        key: 'dwTeams',
        type: 'multiCheckbox',
        templateOptions: {
            label: 'Teams',
            options: $scope.plTeams,
            valueProp: 'id'
        }
    }, {
        key: 'dwExtractors',
        type: 'multiCheckbox',
        templateOptions: {
            label: 'Extractors',
            options: $scope.plExtractors,
            valueProp: 'id'
        }
    }];

    $scope.delete = function(domain) {
        if(domain.id) {
            DomainsService.deleteDomain(domain, function () {
                $scope.safeDisplayedDomains = DomainsService.getDomains();
                $state.go('^.list');
            });
        }else{
            $state.go('^.list');
        }
    };

    $scope.deleteFile = function(index, id) {
        CoreService.confirm(gettextCatalog.getString('Are you sure?'),
            gettextCatalog.getString('Deleting this cannot be undone'),
            function() {
                $http.delete(CoreService.env.apiUrl +
                    '/containers/files/files/' + encodeURIComponent(id)).success(
                    function(data, status, headers) {
                        console.log(data);
                        console.log(status);
                        console.log(headers);
                        $scope.files.splice(index, 1);
                        CoreService.toastSuccess(gettextCatalog.getString(
                            'File deleted'), gettextCatalog.getString(
                            'Your file is deleted!'));
                    });
            },
            function() {
                return false;
            });
    };

    $scope.onlyUnique = function (value, index, self) {
        return self.indexOf(value) === index;
    };

    $scope.export = function(domain){
        DomainsService.getPrettyDomain(domain.id).$promise.then(function(foundDomain){
            var domainItems = [];
            var domainTypes = [];
            DomainsService.getDomainUrls(domain.id).$promise.then(function(trails){
                var constructedDomain = {};
                var domainUrls = [];
                var domainSearchTerms = [];
                var domainExtractions = [];

                trails.forEach(function(trail){
                    if(trail.trailUrls){
                        trail.trailUrls.forEach(function (trailUrl){
                            domainUrls.push(trailUrl.url);

                            if(trailUrl.searchTerms){
                                //Don't get duplicate searchTerms
                                if(domainSearchTerms.indexOf(trailUrl.searchTerms[0])==-1){
                                    domainSearchTerms.push(trailUrl.searchTerms[0]);
                                }
                            }

                            if(trailUrl.urlExtractions){
                                trailUrl.urlExtractions.forEach(function(extraction){
                                    domainExtractions.push(extraction.extractorTypes.toString() +':' +extraction.value);
                                })
                            }
                        });
                    }
                });

                if(foundDomain.domainItems){
                    foundDomain.domainItems.forEach(function(domainItem){
                        var newDomainItem = {value:domainItem.itemValue,type:domainItem.type,source:domainItem.source};
                        domainItems.push(newDomainItem);
                    });
                }

                if(foundDomain.domainEntityTypes){
                    foundDomain.domainEntityTypes.forEach(function(domainType){
                        var newDomainType = {name:domainType.name,source:domainType.source};
                        domainTypes.push(newDomainType);
                    });
                }

                var domainTop50Extractions = DomainsService.getTopExtractions(domainExtractions,50);
                var domainTop25 = DomainsService.getTopLevels(domainUrls,25);

                constructedDomain['domainName'] = foundDomain.name;
                constructedDomain['urls'] = lodash.uniq(domainUrls); //Deduped
                constructedDomain['searchTerms'] = domainSearchTerms; //no need to Dedupe
                constructedDomain['top25Urls'] = domainTop25; //contains counts
                constructedDomain['top50ExtractedTerms'] = domainTop50Extractions; //contains counts
                constructedDomain['domainEntities'] = lodash.uniqBy(domainItems,'value'); //Deduped
                constructedDomain['domainEntityTypes'] = lodash.uniqBy(domainTypes,'name'); //Deduped

                $scope.saveFile(foundDomain.name + '.json',JSON.stringify(constructedDomain));
            });
        });
    };

    $scope.saveFile = function(filename,strFile){
        //more complex, specify name
        var uriContent = "data:application/json," + encodeURIComponent(strFile);

        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            document.body.appendChild(link); // Firefox requires the link to be in the body
            link.download = filename;
            link.href = uriContent;
            link.click();
        }else {
            location.replace(uri);
        }
        document.body.removeChild(link); // remove the link when done
    };

    $scope.importFile = function(index, file){
        //{{apiUrl}}/containers/files/download/{{file.name}}
        var url =  CoreService.env.apiUrl + 'containers/files/download/' + encodeURIComponent(file.name);
        $http.get(url).
            success(function(response) {
                // this callback will be called asynchronously
                // when the response is available

               //Iterate over domain to create domain, domain entityTypes, domainItems
                DomainsService.upsertDomain(response, function() {
                    $scope.safeDisplayedDomains = DomainsService.getDomains();
                    $state.go('^.list');
                });
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert("error");
            });
    };

    $scope.onSubmit = function() {
        DomainsService.upsertDomain($scope.domain, function() {
            $scope.safeDisplayedDomains = DomainsService.getDomains();
            $state.go('^.list');
        });
    };

    $scope.upload = function() {
        $state.go('^.upload');
    };

    $scope.uploadAllDomains = function(uploader){
        uploader.uploadAll();

        //After uploading go to the Import page so that they can actually be imported
        $state.go('^.import');
    };

    $scope.uploadDomain = function(item){
        item.upload();
        //After uploading go to the Import page so that they can actually be imported
        $state.go('^.import');
    };

    // create a uploader with options
    var uploader = $scope.uploader = new FileUploader({
        scope: $scope, // to automatically update the html. Default: $rootScope
        url: CoreService.env.apiUrl + '/containers/files/upload',
        formData: [{
            key: 'value'
        }]
    });

    $scope.loadPicklists = function () {
        DwExtractor.find({filter: {include: []}}).$promise
            .then(function (allExtractors) {
                for (var i = 0; i < allExtractors.length; ++i) {
                    $scope.plExtractors.push({
                        value: allExtractors[i].name,
                        name: allExtractors[i].name,
                        id: allExtractors[i].id
                    });
                }
            })
            .catch(function (err) {
                console.log(err);
            })
            .then(function () {
            }
        );

        DwTeam.find({filter: {include: []}}).$promise
            .then(function (allTeams) {
                for (var i = 0; i < allTeams.length; ++i) {
                    $scope.plTeams.push({
                        value: allTeams[i].name,
                        name: allTeams[i].name,
                        id: allTeams[i].id
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
        $scope.getFilteredPagedResults($scope.currentUser.teams, $scope.itemIndex,  $scope.itemsPerPage);
    };

    $scope.prevPage = function(){
        $scope.itemIndex = $scope.itemIndex - $scope.itemsPerPage;
        $scope.getFilteredPagedResults($scope.currentUser.teams, $scope.itemIndex,  $scope.itemsPerPage);
    };

    $scope.getFilteredPagedResults = function(teams, itemIndex, itemsPer) {
        $scope.loading = true;

        DomainsService.getUserPagedTeamDomains(teams, itemIndex, itemsPer).$promise.then(function (result) {
            var domains = [];
            result.forEach(function (team) {
                if(team.domains){

                    team.domains.forEach(function (domain){
                        domains.push({
                            name: domain.name,
                            description: domain.description,
                            id: domain.id,
                            teams: domain.teams,
                            trails: domain.trails,
                            domainEntityTypes: domain.domainEntityTypes,
                            domainItems: domain.domainItems
                        });
                        //filter duplicates
                        if(domains.indexOf(domain)!=-1){
                            domains.push(domain);
                        }
                    });
                }
            });
            $scope.domain = {};
            $scope.safeDisplayedDomains = domains;
            $scope.displayedDomains = [].concat($scope.safeDisplayedDomains);

            $scope.setPageButtons(result.length);
            $scope.loading = false;
        });
    };

    $scope.getPagedResults = function(itemIndex, itemsPer) {
        $scope.loading = true;

        DomainsService.getPagedDomains(itemIndex, itemsPer).$promise.then(function (result) {
            $scope.domain = {};
            $scope.safeDisplayedDomains = result;
            $scope.displayedDomains = [].concat($scope.safeDisplayedDomains);

            $scope.setPageButtons(result.length);
            $scope.loading = false;
        });
    };

    $scope.loading = true;
    AppAuth.getCurrentUser().then(function (currUser) {
        $scope.currentUser = currUser;
        $scope.loadPicklists(currUser);
        if ($stateParams.id) {
            DomainsService.getDomain($stateParams.id).$promise.then(function (result) {
                $scope.domain = result;
                $scope.safeDisplayedDomains = {};
                $scope.displayedDomains = {};
                $scope.loading = false;
            })
        } else {
            if(!currUser.isAdmin){
                //get domain info for the given user based on user's teams
                if (currUser.teams) {
                    $scope.getFilteredPagedResults(currUser.teams, $scope.itemIndex, $scope.itemsPerPage);
                }
            }else{
                $scope.getPagedResults($scope.itemIndex, $scope.itemsPerPage);
            }
        }
    }, function (err) {
        console.log(err);
    });

    $scope.files = [];

    $scope.load = function() {
        $http.get(CoreService.env.apiUrl + '/containers/files/files').success(
            function(data) {
                console.log(data);
                $scope.files = data;
            });
    };

    $scope.$on('uploadCompleted', function(event) {
        console.log('uploadCompleted event received');
        console.log(event);
        $scope.load();
    });
});

