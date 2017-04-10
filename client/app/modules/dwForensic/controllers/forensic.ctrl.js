'use strict';
var app = angular.module('com.module.dwForensic');
function cullNodesWithNoOutboundLinks(graph) {
    let links = graph.links.slice(0).sort((a, b) => {
        return a.source - b.source;
    });
    let nodes = graph.nodes.slice(0);
    let newNodes = [];
    let newLinks = [];
    for (let i = 0; i < nodes.length; ++i) {
        for (let j = 0; j < links.length; ++j) {
            if (links[j].source === i && !nodes[i].included) {
                //keep it
                nodes[i].included = true;
                nodes[i].oldIndex = i;
                newNodes.push(nodes[i]);
                while (links.length && links[j].source === i) {
                    links.splice(j, 1);
                }
                break;
            }
        }
    }
    links = graph.links.slice(0);
    //If a link has a target node that still exists, add it to newLinks
    for (let j = 0; j < links.length; ++j) {
        for (let i = 0; i < newNodes.length; ++i) {
            newNodes[i].index = i;
            if (links[j].target === newNodes[i].oldIndex) {
                newLinks.push(links[j]);
                break;
            }
        }
    }

    for (let i = 0; i < newNodes.length; ++i) {
        for (let j = 0; j < newLinks.length; ++j) {
            if (newNodes[i].oldIndex === newLinks[j].source) {
                newLinks[j].source = i;
            }
            if (newNodes[i].oldIndex === newLinks[j].target) {
                newLinks[j].target = i;
            }
        }
    }
    graph.nodes = newNodes;
    graph.links = newLinks;
}

app.controller('ForensicCtrl', function ($scope, $state, $stateParams, AminoUser, DwTeam, DwTrail, DwDomainEntityType, ForensicService, gettextCatalog, AppAuth) {
    $scope.trail = {};

    $scope.teams = [];
    $scope.domains = [];
    $scope.trails = [];
    $scope.selectedTeam = null;

    $scope.selectedDomain = null;
    $scope.selectedTrail = null;
    $scope.selectedViews = [];
    $scope.entitiesGrid = [];
    $scope.cullLeaves = false;
    $scope.drawAllLabels = false;


    //Setup the view dropdown menu
    $scope.views = [];
    //$scope.viewSettings = {buttonClasses: 'btn btn-primary btn-sm', displayProp: 'name'};
    //$scope.viewCustomText = {buttonDefaultText: 'Select Views'};


    $scope.teamChanged = function (team) {
        $scope.selectedTeam = team;
        $scope.selectedDomain = null;
        $scope.selectedTrail = null;
        $scope.domains = team.domains;
    };

    $scope.domainChanged = function (domain) {
        $scope.selectedDomain = domain;
        $scope.selectedTrail = null;
        $scope.trails = domain.trails;
    };

    $scope.trailChanged = function (trail) {
        $scope.selectedTrail = trail;
        $scope.views = [];
        $scope.getEntityTypes(trail.id);
    };

    $scope.getEntityTypes = function (trailId) {
        var filter = {
            filter: {
                "where": {"id": trailId},
                "include": [{
                    "relation": "trailUrls",
                    "scope": {
                        "include": [{
                            "relation": "urlExtractions",
                            "scope": {"where": {"extractorTypes": {"neq": null}}}
                        }]
                    }
                }]
            }
        };
        var entityTypes = [];
        var entityObjects = [];

        DwTrail.findOne(filter).$promise.then(function (trail) {
            trail.trailUrls.forEach(function (trailUrl) {
                if (trailUrl.urlExtractions.length) {
                    trailUrl.urlExtractions.forEach(function (urlExtraction) {
                        urlExtraction.extractorTypes.forEach(function (type) {
                            if (entityTypes.indexOf(type) === -1 && type != "_Feature" && type != "owl#Thing" && type != "text") {
                                entityTypes.push(type);
                            }
                        });
                    })
                }
            });
            entityTypes.forEach(function (entity) {
                entityObjects.push({name: entity});
            });

            $scope.views = entityObjects;
        });
    };

    $scope.drawDomainItemsGraph = function () {

        if ($scope.selectedTrail) {

            var graphViews = ForensicService.buildGraphViews($scope.selectedViews);
            var filter = {
                filter: {
                    "where": {
                        "id": $scope.selectedTrail.id
                    },
                    "include": ["domain", "team", {
                        "relation": "trailUrls",
                        "scope": {
                            "include": [{
                                "relation": "urlExtractions",
                                "scope": {"where": {"extractorTypes": {"inq": graphViews}}}
                            }]
                        }
                    }]
                }
            };
            console.log("Trail Filter");
            console.log(JSON.stringify(filter));
            DwTrail.findOne(filter).$promise
                .then(function (trail) {
                    var graph = ForensicService.getBrowsePathEdgesWithInfo(trail, $scope.selectedViews);
                    if ($scope.cullLeaves) {
                        cullNodesWithNoOutboundLinks(graph);
                    }
                    try {

                        graph.drawAllLabels = $scope.drawAllLabels;
                        change_domain_items_graph(graph);
                    } catch (e) {
                        console.log(e);
                    }
                    $scope.visitedGrid = trail.trailUrls;
                    $scope.entitiesGrid = ForensicService.getEntities(trail, $scope.selectedViews);
                    $scope.words = ForensicService.getWords($scope.entitiesGrid);
                })
                .catch(function (err) {
                    console.log("Error getting trail: " + $scope.selectedTrail.id);
                    console.log(err);
                });
        }
    };

    $scope.drawExtractedEntitiesGraph = function () {

        if ($scope.selectedTrail) {

            var graphViews = ForensicService.buildGraphViews($scope.selectedViews);
            var filter = {
                filter: {
                    "where": {
                        "id": $scope.selectedTrail.id
                    },
                    "include": ["domain", "team", {
                        "relation": "trailUrls",
                        "scope": {
                            "include": [{
                                "relation": "urlExtractions",
                                "scope": {"where": {"extractorTypes": {"inq": graphViews}}}
                            }]
                        }
                    }]
                }
            };
            console.log("Trail Filter");
            console.log(JSON.stringify(filter));
            DwTrail.findOne(filter).$promise
                .then(function (trail) {
                    var graph = ForensicService.getBrowsePathEdgesWithInfo(trail, $scope.selectedViews);
                    if ($scope.cullLeaves) {
                        cullNodesWithNoOutboundLinks(graph);
                    }
                    try {

                        graph.drawAllLabels = $scope.drawAllLabels;
                        change_extracted_entities_graph(graph);
                    } catch (e) {
                        console.log(e);
                    }
                    $scope.visitedGrid = trail.trailUrls;
                    $scope.entitiesGrid = ForensicService.getEntities(trail, $scope.selectedViews);
                    $scope.words = ForensicService.getWords($scope.entitiesGrid);
                })
                .catch(function (err) {
                    console.log("Error getting trail: " + $scope.selectedTrail.id);
                    console.log(err);
                });
        }
    };

    $scope.loading = true;
    AppAuth.getCurrentUser().then(function (currUser) {

        if (!currUser.isAdmin) {
            var userFilter = {
                filter: {
                    where: {
                        id: currUser.id
                    },
                    "include": [{
                        "relation": "teams",
                        "scope": {"include": [{"relation": "domains", "scope": {"include": [{"relation": "trails"}]}}]}
                    }]
                }
            };
            console.log("userFilter");
            console.log(JSON.stringify(userFilter));
            AminoUser.findOne(userFilter).$promise
                .then(function (user) {
                    $scope.teams = user.teams;

                })
                .catch(function (err) {
                    console.log("Error getting trail: " + trailId);
                    console.log(err);
                });
            $scope.loading = false;
        } else {
            var teamFilter = {
                filter: {
                    "include": [{
                        "relation": "domains",
                        "scope": {"include": [{"relation": "trails"}]}
                    }]
                }
            };

            console.log("teamFilter");
            console.log(JSON.stringify(teamFilter));
            DwTeam.find(teamFilter).$promise
                .then(function (teams) {
                    $scope.teams = teams;

                })
                .catch(function (err) {
                    console.log("Error getting admin teams");
                    console.log(err);
                });
            $scope.loading = false;
        }

    });
});
