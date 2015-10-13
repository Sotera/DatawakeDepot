var {setInterval, clearInterval} = require('sdk/timers');
var {pluginState} = require('./pluginState');
exports.init = function () {
  var tabs = require('sdk/tabs');
  var { Toolbar } = require('sdk/ui/toolbar');
  var { Frame } = require('sdk/ui/frame');
  var frame = new Frame({
    url: './toolbarFrame.html',
    onMessage: (e)=> {
      var msg = e.data;
      switch (msg.action) {
        case 'page-loaded':
          pluginState.toolbarFrameSource = e.source;
          pluginState.toolbarFrameOrigin = e.origin;
          break;
        case 'login':
          //Aim a browser tab at our login screen
          tabs.open({
            url: pluginState.loginUrl
          });
          break;
        case 'logout':
          logoutSuccessfulHandler(false);
          //In case the login tab is open. Someday we may support multiple open
          //login tabs. Not today.
          pluginState.postEventToDatawakeDepotContentScript('logout-target-content-script');
          break;
        case 'set-trailing-active':
          pluginState.trailingActive = msg.data;
          break;
        case 'request-trails-target-addin':
          refreshTeamsDomainsTrails();
          break;
        case 'set-current-domain-target-addin':
          for (var i = 0; i < pluginState.currentDomainList.length; ++i) {
            if (pluginState.currentDomainList[i].name == msg.domainValue) {
              pluginState.currentDomain = pluginState.currentDomainList[i];
              break;
            }
          }
          break;
        case 'set-current-trail-target-addin':
          for (var i = 0; i < pluginState.currentTrailList.length; ++i) {
            if (pluginState.currentTrailList[i].name == msg.trailValue) {
              pluginState.currentTrail = pluginState.currentTrailList[i];
              break;
            }
          }
          break;
      }
    }
  });
  var toolbar = Toolbar({
    title: 'Datawake',
    items: [frame]
  });
  tabs.on('ready', function (tab) {
    if (!pluginState.trailingActive) {
      return;
    }
    pluginState.restPost(pluginState.trailsUrlsUrl,
      {
        trailId: pluginState.currentTrail.trailId,
        url: tab.url
      }, function (res) {
        console.log(res.text);
      }
    );
  });
  //Here we listen for when the Scraper content script is fired up and ready.
  pluginState.onAddInModuleEvent('page-scraper-content-script-attached-target-addin', function (data) {
    pluginState.addScraperContentScriptEventHandler('zipped-html-body', function (pageContents) {
      //TODO: Work out some scraper eventing so we don't do the DOM operation if we're not trailing.
      //This will work for now though.
      if (!pluginState.trailingActive) {
        return;
      }
      //HowTo: decode (unzip) in addin
      /*      var JSZip = require('./vendor/jszip/jszip.min.js');
       var zip = new JSZip();
       zip.load(pageContents.zippedHtmlBody);
       var html = zip.file('zipped-html-body.zip').asText();*/
    });
  });
  //Here we listen for when the DD content script is fired up and ready.
  pluginState.onAddInModuleEvent('page-datawake-depot-content-script-attached-target-addin', function (data) {
    pluginState.addDatawakeDepotContentScriptEventHandler('logout-success-target-plugin', function (user) {
      logoutSuccessfulHandler(true);
    });
    pluginState.addDatawakeDepotContentScriptEventHandler('login-success-target-plugin', function (user) {
      loginSuccessfulHandler(user);
    });
  });
};
function logoutSuccessfulHandler(tellToolBar) {
  stopTenSecondTimer();
  pluginState.reset();
  pluginState.postEventToAddInModule('logged-out-target-context-menu');
  pluginState.loggedInUser = null;
  if (!tellToolBar) {
    return;
  }
  var msg = {
    type: 'logout-success-target-toolbar-frame'
  }
  pluginState.postMessageToToolBar(msg);
}
function loginSuccessfulHandler(user) {
  startTenSecondTimer();
  pluginState.postEventToAddInModule('logged-in-target-context-menu');
  pluginState.loggedInUser = user;
  var msg = {
    type: 'login-success-target-toolbar-frame',
    pluginState: pluginState
  };
  pluginState.postMessageToToolBar(msg);
}
function refreshTeamsDomainsTrails() {
  if (pluginState.trailingActive) {
    return;
  }
  pluginState.restGet(pluginState.domainsUrl,
    function (res) {
      if (compareDomainLists(res.json, pluginState.currentDomainList)) {
        return;
      }
      pluginState.currentDomainList = res.json;
      var msg = {
        type: 'updated-domains-target-toolbar-frame',
        domains: pluginState.currentDomainList,
        currentDomain: pluginState.currentDomain
      }
      pluginState.postMessageToToolBar(msg);
    }
  );
  pluginState.restGet(pluginState.trailsUrl,
    function (res) {
      if (compareTrailLists(res.json, pluginState.currentTrailList)) {
        return;
      }
      pluginState.currentTrailList = res.json;
      var msg = {
        type: 'updated-trails-target-toolbar-frame',
        trails: pluginState.currentTrailList,
        currentTrail: pluginState.currentTrail
      }
      pluginState.postMessageToToolBar(msg);
    }
  );
}
function compareDomainLists(domainList0, domainList1) {
  try {
    if (domainList0.length != domainList1.length) {
      return false;
    }
    return true;
  }
  catch (err) {
    return false;
  }
}
function compareTrailLists(trailList0, trailList1) {
  try {
    if (trailList0.length != trailList1.length) {
      return false;
    }
    return true;
  }
  catch (err) {
    return false;
  }
}
function stopTenSecondTimer() {
  clearInterval(pluginState.tenSecondTimer);
}
function startTenSecondTimer() {
  pluginState.tenSecondTimer = setInterval(function () {
    refreshTeamsDomainsTrails();
  }, 10000);
}
