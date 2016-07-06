'use strict';
var app = angular.module('com.module.dwTrails');

app.controller('TrailsCtrl', function ($scope, $state, $http, $stateParams, DwTeam, DwDomain, TrailsService, gettextCatalog, AppAuth, FileUploader, CoreService, lodash) {
    $scope.plDomains = [];
    $scope.plTeams = [];
    $scope.trail = {};
    $scope.defaultDomains = true;

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
        var filename = 'test.json';

        link.setAttribute('download', filename);
        link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
        link.style.cssText = "position: absolute !important; left: -9999px; visibility: hidden;";//hide element
        link.innerHTML = "text";
        document.body.appendChild(link);
        link.click();
        setTimeout(function(){
            document.body.removeChild(link);//remove element
        }, 1);
    };

    $scope.delete = function (trail) {
        if(trail.id){
            TrailsService.deleteTrail(trail, function () {
                $scope.getPagedResults($scope.itemIndex, $scope.itemsPerPage);
                $state.go('^.list');
            });
        }
        $state.go('^.list');

    };

    $scope.onSubmit = function () {
        TrailsService.upsertTrail($scope.trail, function () {
            $scope.getPagedResults($scope.itemIndex, $scope.itemsPerPage);
            $state.go('^.list');
        });
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
        if(!$scope.currentUser.isAdmin) {
            $scope.getFilteredPagedResults($scope.currentUser.teams, $scope.itemIndex, $scope.itemsPerPage);
        }else{
            $scope.getPagedResults($scope.itemIndex, $scope.itemsPerPage);
        }
    };

    $scope.prevPage = function(){
        $scope.itemIndex = $scope.itemIndex - $scope.itemsPerPage;
        if(!$scope.currentUser.isAdmin) {
            $scope.getFilteredPagedResults($scope.currentUser.teams, $scope.itemIndex, $scope.itemsPerPage);
        }else{
            $scope.getPagedResults($scope.itemIndex, $scope.itemsPerPage);
        }
    };

    $scope.getFilteredPagedResults = function(teams, itemIndex, itemsPer) {
        $scope.loading = true;

        TrailsService.getUserPagedTeamTrails(teams, itemIndex, itemsPer).$promise.then(function (result) {
            var trails = [];
            result.forEach(function (team) {
                if(team.trails){

                    team.trails.forEach(function (trail){
                        trails.push({
                            name: trail.name,
                            description: trail.description,
                            id: trail.id,
                            scrape: trail.scrape,
                            timestamp: trail.timestamp,
                            dwDomainId: trail.dwDomainId,
                            teams: trail.teams,
                            trailUrls: trail.trailUrls,
                            trailUrlRatings: trail.trailUrlRatings
                        });
                        //filter duplicates
                        if(trails.indexOf(trail)!=-1){
                            trails.push(trail);
                        }
                    });
                }
            });
            $scope.trail = {};
            $scope.trailUrl = {};
            $scope.safeDisplayedtrails = trails;
            $scope.displayedTrails = [].concat($scope.safeDisplayedtrails);

            $scope.setPageButtons(result.length);
            $scope.loading = false;
        });
    };

    $scope.getPagedResults = function(itemIndex, itemsPer) {
        $scope.loading = true;

        TrailsService.getPagedTrails(itemIndex, itemsPer).$promise.then(function (result) {
            $scope.trail = {};
            $scope.trailUrl = {};
            $scope.safeDisplayedtrails = result;
            $scope.displayedTrails = [].concat($scope.safeDisplayedtrails);

            $scope.setPageButtons(result.length);
            $scope.loading = false;
        });
    };

    $scope.loading = true;
    AppAuth.getCurrentUser().then(function (currUser) {
        $scope.currentUser = currUser;
        $scope.loadPicklists(currUser);
        if ($stateParams.trailId) {
            TrailsService.getNewmanTrail($stateParams.trailId).$promise.then(function (result) {
                $scope.trail = $scope.newmanize(result);
                $scope.safeDisplayedtrails = {};
                $scope.displayedtrails = {};
                $scope.loading = false;
            })
        }else if ($stateParams.id) {
            TrailsService.getTrail($stateParams.id).$promise.then(function (result) {
                $scope.trail = result;
                $scope.safeDisplayedtrails = {};
                $scope.displayedtrails = {};
                $scope.loading = false;
            })
        } else {
            if(!currUser.isAdmin){
                //get trail info for the given user based on user's teams
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

    $scope.htmlToPlaintext = function(text) {
        return String(text).replace(/<[^>]+>/gm, '');
    };

    $scope.newmanize = function(trail){

        //trail urls have to be ordered by timestamp
        var trailName = trail.name;

        var constructedTrail = {
            trailUrls: []
        };
        var constructedTrailUrl = {};
        var constructedTrailUrls = [];
        var trailSource = {};
        var bodyEntities = {};

        trail.trailUrls.forEach(function(trailUrl){
            constructedTrailUrl = {};

            constructedTrailUrl['_id'] = trailUrl.id;
            constructedTrailUrl['_index'] = 'newman-shiavo';
            constructedTrailUrl['_type'] = 'emails';
            constructedTrailUrl['_score'] = .5;

            var fullEnt = [];
            var entityFull = [];
            var entityAll = [];
            var entityLoc = [];
            var entityMisc = [];
            var entityOrg = [];
            var entityPer = [];

            if(trailUrl.urlExtractions.length>0){
                trailUrl.urlExtractions.forEach(function(extraction){

                    fullEnt = [
                        extraction.extractorTypes[0],
                        extraction.value,
                        '135',
                        '.92'
                    ];

                    entityFull.push(fullEnt);

                    entityAll.push(extraction.value);

                    switch (extraction.extractorTypes[0]){
                        case 'PERSON':
                            entityPer.push(extraction.value);
                            break;
                        case 'LOCATION':
                            entityLoc.push(extraction.value);
                            break;
                        case 'ORGANIZATION':
                            entityOrg.push(extraction.value);
                            break;
                        default: //Date, Money
                            entityMisc.push(extraction.value);
                    }
                });

                bodyEntities = {
                    entity_full: entityFull,
                    entity_all: entityAll,
                    entity_location: entityLoc,
                    entity_misc: entityMisc,
                    entity_organization:entityOrg,
                    entity_person: entityPer
                };
            }

            trailSource = {
                body: $scope.htmlToPlaintext(trailUrl.scrapedContent),
                inreplyto: [],
                communities_count: 1,
                attachments: [],
                senders: trailUrl.url,
                senders_line: trailUrl.url,
                tos_line: [trailUrl.url], //[nextUrl],
                ccs_line: [],
                datetime: trailUrl.timestamp,
                case_id: trailUrl.url,
                bccs_line: [],
                references: [],
                messageid: trailUrl.id,
                communities: [{
                    community_id: 999,
                    community: 'datawake'
                }],
                phone_numbers: [],
                label: trailName,
                id: trailUrl.id,
                ingest_id: 'newman-shiavo',
                categories: [trailUrl.url],
                subject: trailUrl.url,
                alt_ref_id: trailUrl.url,
                originating_ips: [],
                tos: [trailUrl.url], //[nextUrl],
                originating_locations: [],
                ccs: [],
                bccs: [],
                'forensic-bcc': [],
                original_artifact: {
                    type: 'mbox',
                    filename: 'mbox'
                },
                entities: {
                    original_lang: 'en',
                    body_entities: bodyEntities,
                    body_entities_translated: {}
                }
            };
            constructedTrailUrl['_source'] = trailSource;

            constructedTrailUrls.push(constructedTrailUrl);
        });


        constructedTrail['trailUrls'] = lodash.uniq(constructedTrailUrls); //Deduped

        return constructedTrail;
    };

});

