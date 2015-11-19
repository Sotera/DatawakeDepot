'use strict';
var app = angular.module('com.module.dwForensic');

app.service('ForensicService', ['$state', 'CoreService', 'DwTrail', 'DwDomainEntityType', 'gettextCatalog', function ($state, CoreService, DwTrail, DwDomainEntityType, gettextCatalog) {

    this.processEdges = function (rawEdges, rawNodes) {
        var nodes = [];
        var edges = [];
        var curr_node = 0;
        var node_map = {};
        var groups = {};
        var curr_group = 0;


        //process add nodes
        for (var name in rawNodes) {
            var node = rawNodes[name];
            if (!(name in nodes)) {
                var groupName = node.groupName;
                if (!(groupName in groups)) {
                    groups[groupName] = curr_group;
                    curr_group++;
                }
                var group = groups[groupName];
                node["group"] = group;
                node["index"] = curr_node;
                node["community"] = "n/a";

                nodes.push(node);
                node_map[name] = curr_node;
                curr_node++;
            }
        }

        for (var edgeNo in rawEdges) {
            var value = 1;

            edges.push({
                "source": node_map[rawEdges[edgeNo].nodeA],
                'target': node_map[rawEdges[edgeNo].nodeB],
                'value': value
            })
        }

        var graph = {'nodes': nodes, 'links': edges}

        return graph

    };

    this.buildGraphViews = function (selectedViews) {
        console.log("selected views");
        console.log(JSON.stringify(selectedViews));
        var graphViews = [];
        for (var i in selectedViews) {
            graphViews.push(selectedViews[i].name);
        }
        return graphViews;
    };

    this.getBrowsePath = function (trail) {
        var edges = [];
        var nodes = {};
        var edgeBuffer = [];

        //Create browse path nodes.
        for (var trailUrl in trail.trailUrls) {
            var url = trail.trailUrls[trailUrl].url;
            if (!(url in nodes)) {
                nodes[url] = {
                    'id': url,
                    'type': 'browse path',
                    'size': 10,
                    'timestamps': [],
                    'name': url,
                    'groupName': url.split('/')[2]
                }
            }
            nodes[url]['timestamps'].push(trail.trailUrls[trailUrl].timestamp);
            edgeBuffer.push(url);
            if (edgeBuffer.length === 2) {
                if (edgeBuffer[0] != edgeBuffer[1]) {
                    edges.push({nodeA: edgeBuffer[0], nodeB: edgeBuffer[1]});
                }
                edgeBuffer = [edgeBuffer[1]]
            }
        }
        return {edges: edges, nodes: nodes}
    };

    this.getBrowsePathEdgesWithInfo = function (trail, views) {
        var browsePathGraph = this.getBrowsePath(trail);

        var nodes = browsePathGraph['nodes'];
        var edges = browsePathGraph['edges'];

        for (var trailUrl in trail.trailUrls) {
            var url = trail.trailUrls[trailUrl].url;
            for (var entities in trail.trailUrls[trailUrl].urlExtractions) {
                var entity = trail.trailUrls[trailUrl].urlExtractions[entities];
                var name = entity.value;
                var type = "";
                views.forEach(function (view) {
                    if (entity.extractorTypes.indexOf(view.name) > -1) {
                        type = type + ", " + view.name;
                    }
                });
                var group = type;
                var node = {"id": name, "type": type, "size": 5, "groupName": group, "name": type + "->" + name};
                if (!(name in nodes)) {
                    nodes[name] = node;
                }
                edges.push({nodeA: url, nodeB: name});
            }
        }

        return this.processEdges(edges, nodes);
    };

    this.getEntities = function (trail, views) {
        var entities = {};
        for (var trailUrlIndex in trail.trailUrls) {
            var trailUrl = trail.trailUrls[trailUrlIndex];
            for (var extractionIndex in trailUrl.urlExtractions) {
                var extraction = trailUrl.urlExtractions[extractionIndex];
                var types = [];
                views.forEach(function (view) {
                    if (extraction.extractorTypes.indexOf(view.name) > -1) {
                        types.push(view.name);
                    }
                });
                var key = extraction.value + "-" + types;
                var entity = null;
                if (entities.hasOwnProperty(key)) {
                    entity = entities[key];
                    entity.count = entity.count + 1;

                } else {
                    entity = {name: extraction.value, type: types, count: 1, url: trailUrl.url}
                }
                entities[key] = entity;
            }
        }
        return entities;
    };

    /**
    todo: BTW- This i ugly, getting the url attributes in another function was becoming a async issue so I made it ugly.
     **/
    this.getSearchTerms = function (trailUrls) {

        trailUrls.forEach(function (trailUrl) {
            var parser = document.createElement('a');
            parser.href = trailUrl.url;
            var decodedUrl = decodeURI(trailUrl.url);
            var searchTerm = "";
            if (parser.hostname.indexOf("google.com") > -1) {
                var results = new RegExp('[\?&#]' + "q" + '=([^&#]*)').exec(decodedUrl);
                if (results != null) {
                    searchTerm = results[1] || 0;
                }

            } else if (parser.hostname.indexOf("yahoo.com") > -1) {
                var results = new RegExp('[\?&#]' + "p" + '=([^&#]*)').exec(decodedUrl);
                if (results != null) {
                    searchTerm = results[1] || 0;
                }

            } else if (parser.hostname.indexOf("bing.com") > -1) {
                var results = new RegExp('[\?&#]' + "pq" + '=([^&#]*)').exec(decodedUrl);
                if (results != null) {
                    searchTerm = results[1] || 0;
                }
            } else if ((parser.hostname.indexOf('doubleclick') > -1) || ( parser.hostname.indexOf('ads') > -1)) {
                // skip common ads
                return;
            }
            else  {
                var results = new RegExp('[\?&#](keyword|query|search|p|q|pq)=([^&#]*)').exec(decodedUrl);
                if (results != null) {
                    searchTerm = results[2] || 0;
                }

            }

            trailUrl['searchTerms'] = searchTerm;

        });
        return trailUrls;

    };

    this.urlParam = function (search, attrib) {

        if (results == null) {
            return null;
        }
        else {
            return results[1] || 0;
        }
    }
}]);