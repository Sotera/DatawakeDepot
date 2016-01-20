'use strict';
var app = angular.module('com.module.dwDomains');

app.controller('DomainsCtrl', function($scope, $state, $http, $stateParams, FileUploader, DwTeam, DwExtractor, CoreService,
                                       DomainsService, gettextCatalog, AppAuth) {
    $scope.plExtractors = [];
    $scope.plFeeds = [];
    $scope.plTeams=[];

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
        key: 'dwFeeds',
        type: 'multiCheckbox',
        templateOptions: {
            label: 'Feeds',
            options: $scope.plFeeds,
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
        DomainsService.deleteDomain(domain, function() {
            $scope.safeDisplayedDomains = DomainsService.getDomains();
            $state.go('^.list');
        });
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

    $scope.export = function(domain){
        DomainsService.getPrettyDomain(domain.id).$promise.then(function(foundDomain){
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
                                domainSearchTerms.push(trailUrl.searchTerms);
                            }
                            //TODO: not sure exactly how many of these we want to return, there will be a LOT
                            if(trailUrl.urlExtractions){
                                trailUrl.urlExtractions.forEach(function(extraction){
                                    domainExtractions.push(extraction.value);
                                })
                            }
                        });
                    }
                });

                //TODO: we need to get the top 20, not just the first 20
                var domainTop20Extractions = domainExtractions.slice(0,20);
                var domainTop5 = DomainsService.getTopLevels(domainUrls,5);

                constructedDomain['domainName'] = foundDomain.name;
                constructedDomain['urls'] = domainUrls;
                constructedDomain['searchTerms'] = domainSearchTerms;
                constructedDomain['domainTop5'] = domainTop5;
                constructedDomain['top20Extractions'] = domainTop20Extractions;
                constructedDomain['domainEntities'] = foundDomain.domainItems;
                constructedDomain['domainEntityTypes'] = foundDomain.domainEntityTypes;

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
            //get domain info for the given user based on user's teams
            if (currUser.teams) {
                DomainsService.getUserTeamDomains(currUser.teams).$promise.then(function (result) {
                    $scope.domain = {};
                    $scope.safeDisplayedDomains = result;
                    $scope.displayedDomains = [].concat($scope.safeDisplayedDomains);
                    $scope.loading = false;
                });
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

