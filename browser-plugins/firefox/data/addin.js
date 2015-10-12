var {Request} = require('sdk/request');
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
          var url = pluginState.loginUrl + '/api/dwTrails';
          Request({
            url: url,
            onComplete: function (res) {
              var msg = {
                type: 'updated-trails-target-toolbar-frame',
                trails: res.json
              }
              pluginState.postMessageToToolBar(msg);
            }
          }).get();
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
    var url = pluginState.loginUrl + '/api/dwTrailUrls';
    Request({
      url: url,
      content: {
        trailId: 1,
        url: tab.url
      },
      onComplete: function (res) {
        console.log(res.text);
      }
    }).post();
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
  pluginState.postEventToAddInModule('logged-in-target-context-menu');
  pluginState.loggedInUser = user;
  var msg = {
    type: 'login-success-target-toolbar-frame',
    user: user
  };
  pluginState.postMessageToToolBar(msg);
}

