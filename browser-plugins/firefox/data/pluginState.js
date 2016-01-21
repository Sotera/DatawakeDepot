var {on, emit} = require('sdk/event/core');
var {Request} = require('sdk/request');
var PluginState = function () {
  var me = this;
  me.loggedInUser = null;
  me.currentTeam = null;
  me.currentTeamList = [];
  me.currentDomain = null;
  me.currentDomainList = [];
  me.currentDomainItems = [];
  me.currentTrail = null;
  me.currentTrailList = [];
  me.loginUrl = '';
  me.textToHtmlUrl = '/textToHtml';
  me.usersUrl = '/api/AminoUsers';
  me.domainsUrl = '/api/dwDomains';
  me.teamsUrl = '/api/dwTeams';
  me.trailsUrl = '/api/dwTrails';
  me.trailsUrlsUrl = '/api/dwTrailUrls';
  me.domainItemsUrl = '/api/dwDomainItems';
  me.domainList = '/widget/get-domain-list';
  me.trailExtractedEntities = '/widget/get-url-entities';
  me.createTrail = '/api/dwTrails';
  me.createEntityType = '/api/DwDomainEntityTypes';
  me.createDomainItem = '/api/dwDomains/_domainId_/domainItems';
  me.dwForensic = '/#/app/dwForensic';
  me.dwTrailUrls = '/#/app/dwTrailUrls/list/';
  me.dwTrails = '/#/app/dwTrails';
  me.dwDomains = '/#/app/dwDomains';
  me.dashboard = '/#/app';
  me.trailingActive = false;
  me.panelActive = true;
  me.dataItemsActive = false;
  me.toolbarFrameSource = null;
  me.toolbarFrameOrigin = null;
  me.datawakeDepotContentScriptHandle = null;
  me.contentScriptHandles = {};
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
    if(me.loggedInUser) {
        queryStringObj.access_token = me.loggedInUser.accessToken;
    }
    var queryStringJson = me.convertObjToQueryString(queryStringObj);
    url = me.loginUrl + url;
    url += '?' + queryStringJson;
    Request({
      url: url,
      onComplete: callback
    }).get();
  };

  me.restSimpleGet = function (url, callback) {
      url = me.loginUrl + url;
      Request({
          url: url,
          onComplete: callback
      }).get();
  };

  me.getDomainList = function (cb) {
      var url = me.domainList;
      me.restSimpleGet(url, function (res) {
          cb(res.text);
      });
  };

  me.getExtractedEntities = function (trailUrl, cb) {
    var url = me.trailExtractedEntities;
    var filter = {
        "trailUrl":trailUrl
    };
    me.restGet(url, filter, function (res) {
      cb(res.text);
    });
  };

  me.getDomainItemsForCurrentDomain = function (cb) {
    var url = me.domainItemsUrl;
    var filter = {
      where: {
        dwDomainId: me.currentDomain.id
      }
    };
    me.restGet(url, {filter: JSON.stringify(filter)}, function (res) {
      me.currentDomainItems = res.json;
      cb(res.json);
    });
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
  me.postEventToContentScript = function (contentScriptKey, eventName, data) {
    var contentScriptHandle = me.contentScriptHandles[contentScriptKey];
    if (!contentScriptHandle) {
      return;
    }
    contentScriptHandle.port.emit(eventName, data);
  };
  me.postEventToDatawakeDepotContentScript = function (eventName, data) {
    if (!me.datawakeDepotContentScriptHandle) {
      return;
    }
    me.datawakeDepotContentScriptHandle.port.emit(eventName, data);
  };
  me.addContentScriptEventHandler = function (contentScriptKey, eventName, cb) {
    var contentScriptHandle = me.contentScriptHandles[contentScriptKey];
    if (!contentScriptHandle) {
      return;
    }
    contentScriptHandle.port.on(eventName, cb);
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
  me.onContentScriptAttach = function (worker) {
    //var newContentScriptKey = me.generateUUID();
    var newContentScriptKey = worker.tab.id;
    me.contentScriptHandles[newContentScriptKey] = worker;
    me.postEventToAddInModule('page-content-script-attached-target-addin',
      {contentScriptKey: newContentScriptKey,pageUrl: worker.tab.url});
    me.postEventToContentScript(newContentScriptKey, 'page-attached-target-content-script',
      {contentScriptKey: newContentScriptKey});
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
  };
  me.generateUUID = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  };
};
if (exports.pluginState == null) {
  exports.pluginState = new PluginState();
}
