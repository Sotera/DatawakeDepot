var self = require('sdk/self');
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
        case 'toggle-panel':
          var activeTabId = tabs.activeTab.id;
          pluginState.panelActive = msg.data;
          pluginState.postEventToContentScript(activeTabId, 'send-toggle-datawake-panel',{panelActive:msg.data});
          break;
        case 'toggle-dataitems':
          var activeTabId = tabs.activeTab.id;
          pluginState.dataitemsActive = msg.data;

          //TODO: optimize, don't have to get dataitems every time, instead get at login and update when items added
          pluginState.getDomainItemsForCurrentDomain(function (domainItems) {
              var domainItemValues = [];
              domainItems.forEach(function (domainItemValue) {
                  domainItemValues.push(domainItemValue.itemValue);
              });
              pluginState.postEventToContentScript(activeTabId, 'send-toggle-datawake-dataitems', {
                  dataitemsActive:msg.data,
                  domainItems:domainItemValues
              });
          });
          break;
        case 'set-trailing-active':
          pluginState.trailingActive = msg.data;
          break;
        case 'set-current-team-target-addin':
          pluginState.currentTeam = pluginState.currentTeamList.filter(function (el) {
            return el.name == msg.value;
          })[0];
          pluginState.postEventToAddInModule('get-domains-for-current-team');
          break;
        case 'set-current-domain-target-addin':
          pluginState.currentDomain = pluginState.currentDomainList.filter(function (el) {
            return el.name == msg.value;
          })[0];
          pluginState.postEventToAddInModule('get-trails-for-current-team-and-domain');
          break;
        case 'set-current-trail-target-addin':
          pluginState.currentTrail = pluginState.currentTrailList.filter(function (el) {
            return el.name == msg.value;
          })[0];
          break;
        case 'add-current-trail-to-domain-target-addin':
          var newTrail = msg.trailName;
          addTrail(newTrail);
          break;
        case 'open-new-tab-target-addin':
          var target = '';

            switch (msg.tabTarget){
                case 'dwForensic':
                    target = pluginState.dwForensic;
                    break;
                case 'dwTrailUrls':
                    target = pluginState.dwTrailUrls + pluginState.currentTrail.id;
                    break;
                default:
                    target = '';
                    break;
            }
          tabs.open(pluginState.loginUrl + target);
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
  });
  //Here we listen for when the content scripts is fired up and ready.
  pluginState.onAddInModuleEvent('page-content-script-attached-target-addin', function (data) {
    //Listen for panelHTML requests from the injected page
    pluginState.addContentScriptEventHandler(data.contentScriptKey,'requestPanelHtml-target-addin', function () {
        pluginState.getExtractedEntities(data.pageUrl, function (divHtml){
            if (divHtml) {
                var messageToContentScript = {};
                messageToContentScript.panelHtml = divHtml;
                pluginState.postEventToContentScript(data.contentScriptKey, 'send-panel', messageToContentScript);
            }
        });
    });

    //Listen for panel requests to create domain entity type
    pluginState.addContentScriptEventHandler(data.contentScriptKey,'addEntityType-target-addin', function (domainEntity) {
        var newEnt = domainEntity;
        addDomainEntityType(newEnt);
    });

    //Listen for panel requests to create domain item
    pluginState.addContentScriptEventHandler(data.contentScriptKey,'addDomainItem-target-addin', function (domainItem) {
        var newItem = domainItem;
        addDomainItem(newItem);
    });

    pluginState.addContentScriptEventHandler(data.contentScriptKey, 'send-css-urls-target-addin', function (scriptData) {
      pluginState.postEventToContentScript(scriptData.contentScriptKey, 'load-css-urls-target-content-script',
        {
          cssUrls: [
            self.data.url('injectedPageCSS/datawake-analysis.css')
          ]
        });
    });

    //Listens for requests to get user trailing status
    pluginState.addContentScriptEventHandler(data.contentScriptKey, 'requestTrailingActive-target-addin', function (scriptData) {
        pluginState.postEventToContentScript(data.contentScriptKey, 'trailingStatus-target-content-script', {trailingActive: pluginState.trailingActive,panelActive:pluginState.panelActive});
    });

    //Listens for requests to get user trailing status
    pluginState.addContentScriptEventHandler(data.contentScriptKey, 'requestPanelActive-target-addin', function (scriptData) {
        pluginState.postEventToContentScript(data.contentScriptKey, 'panelStatus-target-content-script', {panelActive: pluginState.panelActive});
    });

    //pluginState.addContentScriptEventHandler(data.contentScriptKey,'add-current-trail-to-domain-target-addin', function (trail) {
    //    var newTrail = trail;
    //    addTrail(newTrail);
    //});

    ////Listens for requests to create a new trail
    //  pluginState.addContentScriptEventHandler(data.contentScriptKey, 'add-current-trail-to-domain-target-addin', function (trailInfo) {
    //      pluginState.restPost(pluginState.trailsUrl,
    //          {
    //              dwTeamId: pluginState.currentTeam.id,
    //              dwDomainId: pluginState.currentDomain.id,
    //              scrape: 'body',
    //              name: trailInfo.trailName,
    //              description: trailInfo.trailName
    //          }, function (res) {
    //              //console.log(res.text);
    //          }
    //      );
    //});

    pluginState.addContentScriptEventHandler(data.contentScriptKey, 'zipped-html-body-target-addin', function (pageContents) {
      //TODO: Work out some scraper eventing so we don't do the DOM operation if we're not trailing.
      //This will work for now though.
      if (!pluginState.trailingActive) {
        return;
      }
      //pluginState.restPost(pluginState.textToHtmlUrl,
      // TODO: This still renders some pages multiple times but at least cleans up the ads.
      //if (pageContents.url === tabs.activeTab.url && tabs.activeTab.readyState === 'complete') {
      if (pageContents.url === tabs.activeTab.url) {
        pluginState.restPost(pluginState.trailsUrlsUrl,
            {
              dwTrailId: pluginState.currentTrail.id
              , url: pageContents.url
              , scrapedContent: pageContents.zippedHtmlBody
            }, function (res) {
              //console.log(res.text);
            }
        );
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
  //Here we listen for when to get Team/Domain/Trail info from the server
  pluginState.onAddInModuleEvent('get-teams-for-logged-in-user', function (data) {
    pluginState.getTeamsForLoggedInUser(function (teams) {
      if (!teams || !teams.length) {
        pluginState.currentTeamList = [];
        pluginState.currentTeam = null;
        pluginState.currentDomainList = [];
        pluginState.currentDomain = null;
        pluginState.currentTrailList = [];
        pluginState.currentTrail = null;
        pluginState.postEventToAddInModule('post-plugin-state-to-toolbar');
      } else {
        pluginState.currentTeamList = teams;
        pluginState.currentTeam = teams[0];
        pluginState.postEventToAddInModule('get-domains-for-current-team');
      }
    });
  });
  pluginState.onAddInModuleEvent('get-domains-for-current-team', function (data) {
    pluginState.getDomainsForCurrentTeam(function (domains) {
      if (!domains || !domains.length) {
        pluginState.currentDomainList = [];
        pluginState.currentDomain = null;
        pluginState.currentTrailList = [];
        pluginState.currentTrail = null;
        pluginState.postEventToAddInModule('post-plugin-state-to-toolbar');
      } else {
        pluginState.currentDomainList = domains;
        pluginState.currentDomain = domains[0];
        pluginState.postEventToAddInModule('get-trails-for-current-team-and-domain');
      }
    });
  });
  pluginState.onAddInModuleEvent('get-trails-for-current-team-and-domain', function (data) {
    pluginState.getTrailsForCurrentTeamAndDomain(function (trails) {
      if (!trails || !trails.length) {
        pluginState.currentTrailList = [];
        pluginState.currentTrail = null;
      } else {
        pluginState.currentTrailList = trails;
        pluginState.currentTrail = trails[0];
      }
      pluginState.postEventToAddInModule('post-plugin-state-to-toolbar');
    });
  });
  pluginState.onAddInModuleEvent('post-plugin-state-to-toolbar', function (data) {
    postPluginStateToToolBar();
  });
};

function logoutSuccessfulHandler(tellToolBar) {
  pluginState.reset();
  pluginState.postEventToAddInModule('logged-out-target-context-menu');
  pluginState.loggedInUser = null;
  if (!tellToolBar) {
    return;
  }
  var msg = {
    type: 'logout-success-target-toolbar-frame'
  };
  pluginState.postMessageToToolBar(msg);
}
function loginSuccessfulHandler(user) {
  pluginState.loggedInUser = user;
  pluginState.postEventToAddInModule('logged-in-target-context-menu');
  pluginState.postEventToAddInModule('get-teams-for-logged-in-user');
}
function postPluginStateToToolBar() {
  var semiPluginState = {
    loggedInUser: pluginState.loggedInUser,
    currentTeam: pluginState.currentTeam,
    currentTeamList: pluginState.currentTeamList,
    currentDomain: pluginState.currentDomain,
    currentDomainList: pluginState.currentDomainList,
    currentTrail: pluginState.currentTrail,
    currentTrailList: pluginState.currentTrailList
  };
  var msg = {
    type: 'login-success-target-toolbar-frame',
    pluginState: semiPluginState
  };
  pluginState.postMessageToToolBar(msg);
}

function addDomainEntityType(entType){
  pluginState.restPost(pluginState.createEntityType,
      entType, function (res) {
        console.log(res.text);
      }
  );
}

function addDomainItem(domItem){
  var specificDomainInsertUrl =  pluginState.createDomainItem.replace("_domainId_",domItem.dwDomainId);
  pluginState.restPost(specificDomainInsertUrl,
      domItem, function (res) {
          console.log(res.text);
      }
  );
}

function addTrail(trailName){
    //Create the trail
    var newTrail = {
      dwTeamId: pluginState.currentTeam.id,
      dwDomainId: pluginState.currentDomain.id,
      scrape: 'body',
      name: trailName,
      description: trailName
    };

    pluginState.restPost(pluginState.createTrail,
        newTrail, function (res) {
            console.log(res.text);
        }
    );

    //Reload the plugins trail list to get the new trail
    pluginState.postEventToAddInModule('get-trails-for-current-team-and-domain');

    //Tell the toolbar that all is well
    var msg = {
        type: 'create-trail-success-target-toolbar-frame',
        trailName: trailName
    };
    pluginState.postMessageToToolBar(msg);
}


