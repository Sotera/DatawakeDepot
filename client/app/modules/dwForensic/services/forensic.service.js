'use strict';
var app = angular.module('com.module.dwForensic');

app.service('ForensicService', ['$state', 'CoreService', 'DwTrail', 'DwDomainEntityType', 'gettextCatalog', function ($state, CoreService, DwTrail, DwDomainEntityType, gettextCatalog) {

    this.getDomainEntityTypes = function (domainId) {
        var filter = {"filter": {"where": {"dwDomainId": domainId}}};
        console.log("entityTypeFilter");
        console.log(JSON.stringify(filter));
        return DwDomainEntityType.find(filter);
    };

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
        var graphViews = [];
        for (var i in selectedViews) {
            graphViews.push(selectedViews[i].id);
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

    this.getBrowsePathEdgesWithInfo = function (trail) {
        var browsePathGraph = this.getBrowsePath(trail);

        var nodes = browsePathGraph['nodes'];
        var edges = browsePathGraph['edges'];

        for (var trailUrl in trail.trailUrls) {
            var url = trail.trailUrls[trailUrl].url;
            for (var entities in trail.trailUrls[trailUrl].urlExtractions) {
                var entity = trail.trailUrls[trailUrl].urlExtractions[entities];
                var name = entity.value;
                var type = entity.domainEntityType.name;

                switch (type) {
                    case 'website':
                        var group = name.split('/')[2];
                        break;
                    case 'phone':
                        var group = 'length=' + name.length;
                        break;
                    case 'email':
                        var group = name.split('@')[1];
                        break;
                    case 'info':
                        var group = name.split('->')[0];
                        break;
                }
                var node = {"id": name, "type": type, "size": 5, "groupName": group, "name": type + "->" + name};
                if (!(name in nodes)) {
                    nodes[name] = node;
                }
                edges.push({nodeA: url, nodeB: name});
            }
        }

        return this.processEdges(edges, nodes);
    };

    this.getEntities = function (trail) {
        var entities = {};
        for (var trailUrlIndex in trail.trailUrls) {
            var trailUrl = trail.trailUrls[trailUrlIndex];
            for (var extractionIndex in trailUrl.urlExtractions) {
                var extraction = trailUrl.urlExtractions[extractionIndex];
                var key = extraction.value + "-" + extraction.domainEntityType.name;
                var entity = null;
                if (entities.hasOwnProperty(key)){
                    entity = entities[key];
                    entity.count = entity.count+1;

                } else {
                    entity = {name: extraction.value, type: extraction.domainEntityType.name, count: 1}
                }
                entities[key] = entity;
            }
        }
        return entities;
    };
}]);


