'use strict';
var app = angular.module('com.module.dwTrails');

app.controller('TrailsCtrl', function ($scope, $state, $http, $stateParams, DwTeam, DwDomain, TrailsService, gettextCatalog, AppAuth, FileUploader, CoreService) {
    $scope.plDomains = [];
    $scope.plTeams = [];
    $scope.trail = {};
    $scope.defaultDomains = true;

    $scope.formFields = [{
        key: 'id',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('id'),
            disabled: true
        }
    }, {
        key: 'dwTeamId',
        type: 'select',
        templateOptions: {
            label: gettextCatalog.getString('Team'),
            options: $scope.plTeams,
            valueProp: 'id',
            labelProp: 'name',
            required: true
            ,
            onChange: function ($viewValue) {
                $scope.loadDomains($viewValue);
            }
        }
        ,
        expressionProperties: {
            'templateOptions.disabled': 'model.id'
        }
    }, {
        key: 'dwDomainId',
        type: 'select',
        expressionProperties: {
            // This watches for form changes and enables/disables the Domain dropdown as necessary
            'templateOptions.disabled': function () {
                if($scope.defaultDomains){
                    return true;
                }else{
                    return $scope.plDomains.length <= 0
                }
            }
        },
        templateOptions: {
            label: gettextCatalog.getString('Domain'),
            options: $scope.plDomains,
            valueProp: 'id',
            labelProp: 'name',
            required: true,
            disabled: false
        }
    }, {
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
        key: 'timestamp',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Timestamp'),
            disabled: true,
            required: false
        }
    }];

    $scope.loadDomains = function (teamId) {
        $scope.defaultDomains = false;
        $scope.plDomains.length = 0;
        //Populate plDomains from the domains for the given teamId in plTeams
        $scope.plTeams.forEach(function (team) {
            if (team.id == teamId) {
                $scope.loading = false;
                if (team.domains) {
                    for (var i = 0; i < team.domains.length; ++i) {
                        $scope.plDomains.push({
                            value: team.domains[i].name,
                            name: team.domains[i].name,
                            id: team.domains[i].id
                        });
                    }
                } else {
                    $scope.plDomains.length = 0;
                }
            }
        });
    };

    $scope.loadPicklists = function (aminoUser) {
        //Admins get all teams
        $scope.plTeams.length = 0;
        if (aminoUser.isAdmin) {
            DwTeam.find({filter: {include: ['domains']}}).$promise
                .then(function (allTeams) {
                    for (var i = 0; i < allTeams.length; ++i) {
                        $scope.plTeams.push({
                            value: allTeams[i].name,
                            name: allTeams[i].name,
                            id: allTeams[i].id,
                            domains: allTeams[i].domains
                        });
                    }
                })
                .catch(function (err) {
                    console.log(err);
                })
                .then(function () {
                }
            );
        } else {
            $scope.plTeams.length = 0;
            for (var i = 0; i < aminoUser.teams.length; ++i) {
                $scope.plTeams.push({
                    value: aminoUser.teams[i].name,
                    name: aminoUser.teams[i].name,
                    id: aminoUser.teams[i].id,
                    domains: aminoUser.teams[i].domains
                });
            }
        }
        //set default Domains
        $scope.defaultDomains = true;
        $scope.plDomains.length = 0;
        DwDomain.find().$promise
            .then(function (allDomains) {
                for (var i = 0; i < allDomains.length; ++i) {
                    $scope.plDomains.push({
                        value: allDomains[i].name,
                        name: allDomains[i].name,
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

    $scope.downloadTrail = function (){
        //alert('x');
        var elHtml = document.getElementById('preElement').innerHTML;
        var link = document.createElement('a');
        var mimeType = 'application/json';
        var filename = 'test.json'

        link.setAttribute('download', filename);
        link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
        link.click();
    };

    $scope.delete = function (trail) {
        if(trail.id){
            TrailsService.deleteTrail(trail, function () {
                $scope.safeDisplayedtrails = TrailsService.getTrails();
                $state.go('^.list');
            });
        }else{
            $state.go('^.list');
        }
    };

    $scope.onSubmit = function () {
        TrailsService.upsertTrail($scope.trail, function () {
            $scope.safeDisplayedtrails = TrailsService.getTrails();
            $state.go('^.list');
        });
    };

    $scope.loading = true;
    AppAuth.getCurrentUser().then(function (currUser) {
        $scope.currentUser = currUser;
        $scope.loadPicklists(currUser);
        if ($stateParams.id) {
            TrailsService.getTrail($stateParams.id).$promise.then(function (result) {
                $scope.currentId = $stateParams.id;
                $scope.trail = result;
                $scope.safeDisplayedtrails = {};
                $scope.displayedTrails = {};
                $scope.loading = false;
            })
        } else {
            if(!currUser.isAdmin){
                //get trail info for the given user based on user's teams
                if (currUser.teams) {
                    TrailsService.getUserTeamTrails(currUser.teams).$promise.then(function (result) {
                        $scope.trail = {};
                        $scope.trailUrl = {};
                        $scope.safeDisplayedtrails = result;
                        $scope.displayedTrails = [].concat($scope.safeDisplayedtrails);
                        $scope.loading = false;
                    });
                }
            }else{
                //get all trails for Admin
                TrailsService.getTrails().$promise.then(function (result) {
                    $scope.trail = {};
                    $scope.trailUrl = {};
                    $scope.safeDisplayedtrails = result;
                    $scope.displayedTrails = [].concat($scope.safeDisplayedtrails);
                    $scope.loading = false;
                });
            }
        }
    }, function (err) {
        console.log(err);
    });

    // create a uploader with options
    var uploader = $scope.uploader = new FileUploader({
        scope: $scope, // to automatically update the html. Default: $rootScope
        url: CoreService.env.apiUrl + '/containers/files/upload',
        formData: [{
            key: 'value'
        }]
    });

    $scope.upload = function () {
        $state.go('^.upload');
    };

    $scope.uploadAllTrails = function (uploader) {
        uploader.uploadAll();
        //After uploading go to the Import page so that they can actually be imported
        $state.go('^.import');
    };

    $scope.uploadTrail = function (item) {
        item.upload();
        //After uploading go to the Import page so that they can actually be imported
        $state.go('^.import');
    };

    $scope.$on('uploadCompleted', function (event) {
        console.log('uploadCompleted event received');
        console.log(event);
        $scope.load();
    });

    $scope.files = [];

    $scope.load = function () {
        $http.get(CoreService.env.apiUrl + '/containers/files/files').success(
            function (data) {
                console.log(data);
                $scope.files = data;
            }
        );
    };

    $scope.deleteFile = function (index, id) {
        CoreService.confirm(gettextCatalog.getString('Are you sure?'),
            gettextCatalog.getString('Deleting this cannot be undone'),
            function () {
                $http.delete(CoreService.env.apiUrl +
                    '/containers/files/files/' + encodeURIComponent(id)).success(
                    function (data, status, headers) {
                        console.log(data);
                        console.log(status);
                        console.log(headers);
                        $scope.files.splice(index, 1);
                        CoreService.toastSuccess(gettextCatalog.getString(
                            'File deleted'), gettextCatalog.getString(
                            'Your file is deleted!'));
                    });
            },
            function () {
                return false;
            });
    };

    $scope.importFile = function (index, file) {
        var url = CoreService.env.apiUrl + 'containers/files/download/' + encodeURIComponent(file.name);
        $http.get(url).
            success(function (response) {
                // this callback will be called asynchronously
                // when the response is available
                //Iterate over domain to create domain, domain entityTypes, domainItems
                TrailsService.upsertTrail(response, function () {
                    $scope.safeDisplayedTrails = TrailsService.getTrails();
                    $state.go('^.list');
                });
            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert("error");
            });
    };


});

