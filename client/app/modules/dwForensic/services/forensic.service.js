'use strict';
var app = angular.module('com.module.dwForensic');

app.service('ForensicService', ['$state', 'CoreService', 'DwTrail', 'DwDomainEntityType', 'gettextCatalog', function($state, CoreService, DwTrail, DwDomainEntityType, gettextCatalog) {

  this.getDomainEntityTypes = function() {
    return DwDomainEntityType.find();
  }

  this.getTrails = function() {
    return DwTrail.find();
  };

  this.getTrail = function(id) {
    return DwTrail.findById({
      id: id
    });
  };

  this.processEdges = function (edges, nodes) {
    console.info("how the hell do I make an edge?")
  };

  this.getGraphViews = function (selectedViews) {
    var graphViews = [];
    for (var i in selectedViews) {
      graphViews.push(selectedViews[i].id);
    }
    return graphViews;
  };

  this.getBrowsPath = function (trail_id) {
    var edges = [];
    var nodes = {};
    var edgeBuffer = [];
    var trailUrls = DwTrailUrls.getTrailUrl(trail_id)
    for (var trailUrl in trailUrls) {
      var url = trailUrl['url']
      if (!(url in nodes)) {
        nodes[url] = {
          'id': url,
          'type': 'browse path',
          'size': 10,
          'timestamps': [],
          'groupName': url.split('/')[2]
        }
      }
      nodes[url]['timestamps'].push(trailUrl['timestamp']);
      edgeBuffer.push(url);
      if (edge_buffer.length === 2) {
        if (edge_buffer[0] != edge_buffer[1]) {
          if (!('chrome://newtab/' in edge_buffer[1])) {
            var users1 = nodes[edge_buffer[0]]['userNames'][-1]
            var users2 = nodes[edge_buffer[1]]['userNames'][-1]
            if (users1 === users2) {
              edges.append((edge_buffer[0], edge_buffer[1]))
            }
          }
        }
        edge_buffer = [edge_buffer[1]]
      }


    }
    return null
  };

  this.getBrowsePathEdgesWithInfo = function (trail_id, views) {
    console.info(trail_id);
    console.log(views[0].label);
    return {edges: [], nodes: []}
    //var browsePathGraph = getBrowsePath(trail_id);
    //var nodes = browsePathGraph['nodes'];
    //var edges = browsePathGraph['edges'];
    //// Get browse path url's
    //var urls = Object.keys(browsePathGraph['nodes']);
    //// Get entities for each browse path URL.
    //for (var url in urls) {
    //  // TODO: Using this wrong
    //  // Get entities for each url in the trail
    //  var urlEntities = DwDomainItems.getDomainItems(url);
    //  for (var type in urlEntities) {
    //    name = urlEntities['name'];
    //    switch (type) {
    //      case 'website':
    //        var group = name.split('/')[2]
    //        break;
    //      case 'phone':
    //        var group = 'length=' + name.length;
    //        break;
    //      case 'email':
    //        var group = name.split('@')[1];
    //        break;
    //      case 'info':
    //        var group = name.split('->')[0]
    //        break;
    //    }
    //    var node = {"id": name, "type": type, "size": 5, "gropName": group};
    //    if (!(name in nodes)) {
    //      nodes[name] = node;
    //    }
    //    edges.push(url, name)
    //  }
    //}
  };

}]);
