'use strict';
var app = angular.module('com.module.dwForensic');

app.controller('ForensicCtrl', function ($scope, $state, $stateParams, DwTrail, DwTrailUrl, DwDomainEntityType, ForensicService, gettextCatalog, AppAuth) {

    $scope.trail = {};
    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;
    $scope.domains = [];
    $scope.trails = [];
    $scope.selectedTeam = null;
    $scope.selectedDomain = null;
    $scope.selectedTrail = null;
    $scope.selectedViews = [];

    //Setup the view dropdown menu
    $scope.views = ForensicService.getDomainEntityTypes();
    $scope.viewSettings = {buttonClasses: 'btn btn-primary btn-sm', displayProp: 'name'};
    $scope.viewCustomText = {buttonDefaultText: 'Select Views'};

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
        $scope.views = ForensicService.getDomainEntityTypes();
    };

    $scope.drawGraph = function (trailId) {
        var graphViews = ForensicService.buildGraphViews($scope.selectedViews);
        DwTrail.findOne({
            filter: {
                "where": {"id": trailId},
                "include": ["domain", "team", {
                    "relation": "trailUrls",
                    "scope": {
                        "include": [{
                            "relation": "urlExtractions",
                            "scope": {"where": {"dwDomainEntityTypeId": {"inq": graphViews}}}
                        }]
                    }
                }]
            }
        }).$promise
            .then(function (trail) {
                console.log("Getting trail");
                console.log(JSON.stringify(trail));

                var graph = ForensicService.getBrowsePathEdgesWithInfo(trail);
                console.log("graph");
                console.log(JSON.stringify(graph));
                var fullGraph = ForensicService.processEdges(graph['edges'], graph['nodes'])
                console.log("full graph");
                console.log(JSON.stringify(fullGraph));
                change_graph(fullGraph)
            })
            .catch(function (err) {
                console.log("Error getting trail: " + trailId);
                console.log(err);
            });
    };

    $scope.change_graph = function (graph) {

        communities = {};
        var nodes = graph.nodes.slice();
        var repulsion = 30;
        if (nodes.length < 50) {
            repulsion = parseInt(repulsion_scale(nodes.length));
        }
        console.log("default repulsion = " + repulsion);

        SWG.drawGraph('node_graph', graph);
        SWG.show_base_legend();

        SWG.viz.selectAll(".node").on('click', function (d) {
            console.log("selected: " + JSON.stringify(d));
            selected_data = d;
        });

        SWG.viz.selectAll(".node").on('click', function (d) {
            showLinkDialog(d);
            SWG.viz.selectAll(".node").style("stroke-width", function (d) {
                return 0;
            });
            d3.select(this).style("stroke", function (d) {
                return 'yellow';
            }).style("stroke-width", function (d) {
                return 4;
            });
        });

        SWG.viz.selectAll(".link")
            .attr("class", function (d) {
                if (d[0].name && d[2].name) {
                    var type1 = d[0].name.substring(0, d[0].name.indexOf(":"));
                    var type2 = d[2].name.substring(0, d[2].name.indexOf(":"));
                    if (type1.indexOf('browse path') == 0 && type2.indexOf('browse path') == 0) {
                        return "link boldlink";
                    }
                }
                return "link";
            })
            .attr("marker-end", function (d) {
                if (d[0].name && d[2].name) {
                    var type1 = d[0].name.substring(0, d[0].name.indexOf(":"));
                    var type2 = d[2].name.substring(0, d[2].name.indexOf(":"));
                    if (type1.indexOf('browse path') == 0 && type2.indexOf('browse path') == 0) {
                        return "url(#arrowhead)";
                    }
                }
                return "";
            });
    }

});

