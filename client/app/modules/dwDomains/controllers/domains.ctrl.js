'use strict';
var app = angular.module('com.module.dwDomains');

app.controller('DomainsCtrl', function($scope, $state, $http, $stateParams, DwFeed, DwDomain, FileUploader, DwTeam, DwExtractor, CoreService, DomainsService, gettextCatalog, AppAuth) {
    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;
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



    $scope.loading = true;
    if($scope.currentUser.isAdmin){
        DwDomain.find({filter: {include: ['domainEntityTypes','domainItems','extractors','trails','feeds','teams']}}).$promise
            .then(function (allDomains) {
                $scope.safeDisplayedDomains = allDomains;
                $scope.displayedDomains = [].concat($scope.safeDisplayedDomains);
            })
            .catch(function (err) {
                console.log(err);
            })
            .then(function () {
                $scope.loading = false;
            });
    }else{
        if($scope.currentUser.teams){
            $scope.userDomains = [];
            for (var i = 0; i < $scope.currentUser.teams.length; ++i) {
                $scope.userDomains.push.apply($scope.userDomains,$scope.currentUser.teams[i].domains);
            }
            $scope.safeDisplayedDomains = $scope.userDomains;
            $scope.displayedDomains = [].concat($scope.safeDisplayedDomains);
        }
        $scope.loading = false;

    }

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

    DwFeed.find({filter: {include: []}}).$promise
        .then(function (allFeeds) {
            for (var i = 0; i < allFeeds.length; ++i) {
                $scope.plFeeds.push({
                    value: allFeeds[i].name,
                    name: allFeeds[i].name,
                    id: allFeeds[i].id
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

    if ($stateParams.id) {
        $scope.loading = true;
        DwDomain.findOne({
            filter: {
                where: {
                    id: $stateParams.id
                },
                fields:{'name':true,'description':true,'id':true},
                include: ['domainEntityTypes','domainItems']
            }
        }).$promise
            .then(function (domain) {
                $scope.domain = domain;
            });
        $scope.loading = false;
    } else {
        $scope.domain = {};
    }

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

