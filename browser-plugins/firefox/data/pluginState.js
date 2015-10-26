var {on, emit} = require('sdk/event/core');
var {Request} = require('sdk/request');
var PluginState = function () {
  var me = this;
  me.loggedInUser = null;
  me.currentTeam = null;
  me.currentTeamList = [];
  me.currentDomain = null;
  me.currentDomainList = [];
  me.currentTrail = null;
  me.currentTrailList = [];
  me.loginUrl = '';
  me.usersUrl = '/api/AminoUsers';
  me.domainsUrl = '/api/dwDomains';
  me.teamsUrl = '/api/dwTeams';
  me.trailsUrl = '/api/dwTrails';
  me.trailsUrlsUrl = '/api/dwTrailUrls';
  me.trailingActive = false;
  me.toolbarFrameSource = null;
  me.toolbarFrameOrigin = null;
  me.datawakeDepotContentScriptHandle = null;
  me.scraperContentScriptHandle = null;
  me.pageModDatawakeDepotIncludeFilter = null;
  me.restPost = function (url, content, callback) {
    url = me.loginUrl + url;
    Request({
      url: url,
      content: content,
      onComplete: callback
    }).post();
  };
  me.restGet = function (url, queryStringObj, callback) {
    queryStringObj = queryStringObj || {};
    queryStringObj.access_token = me.loggedInUser.accessToken;
    var queryStringJson = me.convertObjToQueryString(queryStringObj);
    url = me.loginUrl + url;
    url += '?' + queryStringJson;
    Request({
      url: url,
      onComplete: callback
    }).get();
  };
  me.getTrailsForCurrentTeamAndDomain = function (cb) {
    var url = me.trailsUrl;
    var filter = {
      where: {
        and: [{dwTeamId: me.currentTeam.id},
          {dwDomainId: me.currentDomain.id}]
      }
    };
    me.restGet(url, {filter: JSON.stringify(filter)}, function (res) {
      cb(res.json);
    });
  };
  me.getDomainsForCurrentTeam = function (cb) {
    var url = me.teamsUrl;
    url += '/' + me.currentTeam.id;
    url += '/domains';
    me.restGet(url, {}, function (res) {
      cb(res.json);
    });
  };
  me.getTeamsForLoggedInUser = function (cb) {
    var url = me.usersUrl;
    url += '/' + me.loggedInUser.id;
    url += '/teams';
    me.restGet(url, {}, function (res) {
      cb(res.json);
    });
  };
  me.postMessageToToolBar = function (msg) {
    me.toolbarFrameSource.postMessage(JSON.stringify(msg), me.toolbarFrameOrigin);
  };
  me.postEventToScraperContentScript = function (eventName, data) {
    if (!me.scraperContentScriptHandle) {
      return;
    }
    me.scraperContentScriptHandle.port.emit(eventName, data);
  };
  me.postEventToDatawakeDepotContentScript = function (eventName, data) {
    if (!me.datawakeDepotContentScriptHandle) {
      return;
    }
    me.datawakeDepotContentScriptHandle.port.emit(eventName, data);
  };
  me.addScraperContentScriptEventHandler = function (eventName, cb) {
    me.scraperContentScriptHandle.port.on(eventName, cb);
  };
  me.addDatawakeDepotContentScriptEventHandler = function (eventName, cb) {
    me.datawakeDepotContentScriptHandle.port.on(eventName, cb);
  };
  me.postEventToAddInModule = function (eventName, data) {
    emit(exports, eventName, data);
  };
  me.onAddInModuleEvent = function (eventName, cb) {
    on(exports, eventName, cb);
  };
  me.onScraperContentScriptAttach = function (worker) {
    me.scraperContentScriptHandle = worker;
    me.postEventToAddInModule('page-scraper-content-script-attached-target-addin');
    me.postEventToScraperContentScript('page-attached-target-content-script');
  }
  me.onDatawakeDepotContentScriptAttach = function (worker) {
    me.datawakeDepotContentScriptHandle = worker;
    me.postEventToAddInModule('page-datawake-depot-content-script-attached-target-addin');
    me.postEventToDatawakeDepotContentScript('page-attached-target-content-script');
  }
  me.convertObjToQueryString = function (obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
  me.reset = function () {
    me.loggedInUser = null;
    me.currentTeam = null;
    me.currentTeamList = [];
    me.currentDomain = null;
    me.currentDomainList = [];
    me.currentTrail = null;
    me.currentTrailList = [];
  }
};
if (exports.pluginState == null) {
  exports.pluginState = new PluginState();
}
