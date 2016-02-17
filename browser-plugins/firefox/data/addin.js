var self = require('sdk/self');
var {setInterval, clearInterval} = require('sdk/timers');
var {pluginState} = require('./pluginState');
exports.init = function () {
  var tabs = require('sdk/tabs');
  var activeTab = null;
  var currentTrailUrlId = null;

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
          //show sidebar
          if(!pluginState.panelActive){
              sidebar.show();
              pluginState.panelActive=true;
              //Get sidebar contents
              getExtractedEntities(tabs.activeTab.url);
          }else{
              pluginState.panelActive=false;
              sidebar.hide();
          }
          break;
        case 'toggle-dataitems':
          var activeTabId = tabs.activeTab.id;
          pluginState.dataItemsActive = msg.data;
          pluginState.postEventToContentScript(activeTabId, 'send-toggle-datawake-dataitems', {
            dataItemsActive:msg.data,
            dataItems:pluginState.currentDomainItems
          });
          break;
        case 'set-trailing-active':
          pluginState.trailingActive = msg.data;

          if(msg.data)  {
              //Show the sidebar
              sidebar.show();
              pluginState.panelActive=true;
              //Get the domain items in case they want to see them
              pluginState.getDomainItemsForCurrentDomain();
              pluginState.postEventToAddInModule('trailing-active');
          }else{
              //Hide the sidebar
              sidebar.hide();
              pluginState.panelActive=false;
              pluginState.postEventToAddInModule('trailing-inactive');
          }
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
                case 'dashboard':
                    target = pluginState.dashboard;
                    break;
                case 'dwForensic':
                    target = pluginState.dwForensic;
                    break;
                case 'dwTrails':
                    target = pluginState.dwTrails;
                    break;
                case 'dwDomains':
                    target = pluginState.dwDomains;
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

  var sidebarWorker = null;

  var sidebar = require("sdk/ui/sidebar").Sidebar({
      id: 'datawake-sidebar',
      title: 'Datawake Sidebar',
      url: require("sdk/self").data.url("sidebar.html"),
      onAttach: function (worker) {
          sidebarWorker = worker;

          //Listen for sidebar requests to refresh content
          worker.port.on("refreshSidebar", function(data) {
              pluginState.getExtractedEntities(data.pageUrl, function (divHtml){
                  if (divHtml) {
                       //send contents to sidebar
                      sidebarWorker.port.emit("sidebarContent",divHtml);
                  }
              });
          });

          //Listen for sidebar requests to create Domain Items
          worker.port.on('addDomainItem-target-addin', function(domainItem) {
              addDomainItem(domainItem, tabs.activeTab.id);
          });

          //Listen for sidebar requests to create Domain Types
          worker.port.on('addEntityType-target-addin', function(domainType) {
              addDomainEntityType(domainType);
          });

          //Listen for sidebar requests to rate Page
          worker.port.on('ratePage-target-addin', function(data) {
              if(data.event == 'rated'){
                  var urlObj = {url:data.url,pageRating:data.pageRating};

              }else{
                  var urlObj = {url:data.url,pageRating:null};
              }
              urlObj['dwTrailId']=pluginState.currentTrail.id;
              addPageRank(urlObj);
          });
      }
  });

  //Do this on completion of a new tab load (doesn't have to be active)
  tabs.on('ready', function (tab) {
    if (!pluginState.trailingActive) {
        return;
    }else{
        if(pluginState.panelActive && (tabs.activeTab.url == tab.url)) {
            //Send sidebar the current tab info
            sendTabToSidebar(tab);

            //Request fresh sidebar content
            sendExtractionsToSidebar(tab.url);
        }
    }
  });

  //We've selected this tab, get its extracted items for the sidebar
  tabs.on('activate', function (tab) {
      activeTab = tab;

      //Only if we're trailing
      if(pluginState.panelActive) {
          //Send sidebar the current tab info
          sendTabToSidebar(tab);

          //Request rating for this url if it exists
          sendRatingToSidebar(tab.url);

          //Request fresh sidebar content
          sendExtractionsToSidebar(tab.url);

          //Then tell the page to refresh its dataitems
          refreshDataItems(tab.id);
      }
  });

  //We've moved forward or backward in this tab, get its current url's extracted items for the sidebar
  tabs.on('pageshow', function(tab) {
      //Only if we're trailing
      if(pluginState.panelActive) {
          //Send sidebar the current tab info
          sendTabToSidebar(tab);

          //Request rating for this url if it exists
          sendRatingToSidebar(tab.url);

          //Request fresh sidebar content
          sendExtractionsToSidebar(tab.url);

          //Then tell the page to refresh its dataitems
          refreshDataItems(tab.id);
      }
  });

  //Send sidebar the current tab info
  function sendTabToSidebar (tab) {
      sidebarWorker.port.emit("send-sidebar-current-tab", {
          contentScriptKey: tab.id,
          pageUrl: tab.url
      })
  }

  //Request rating for given tab's url if it exists
  function sendRatingToSidebar(tabUrl){
      pluginState.getPageRating(tabUrl, function (rating) {
          if (rating) {
              //send rating to sidebar
              sidebarWorker.port.emit("sidebarRating", rating);
          }else{
              sidebarWorker.port.emit("sidebarRating", null);
          }
      });
  }

  //Request extractions for given tab's url if they exists
  function sendExtractionsToSidebar(tabUrl){
      pluginState.getExtractedEntities(tabUrl, function (divHtml) {
          if (divHtml) {
              //send contents to sidebar
              sidebarWorker.port.emit("sidebarContent", divHtml);
          }
      });
  }

  function refreshDataItems(tabId){
      pluginState.postEventToContentScript(tabId, 'refresh-data-items-target-content-script', {
          dataItemsActive: pluginState.dataItemsActive,
          dataItems: pluginState.currentDomainItems
      });
  }

  //Here we listen for when the content scripts is fired up and ready.
  pluginState.onAddInModuleEvent('page-content-script-attached-target-addin', function (data) {

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
        pluginState.postEventToContentScript(data.contentScriptKey, 'trailingStatus-target-content-script', {
            trailingActive: pluginState.trailingActive,
            panelActive:pluginState.panelActive,
            dataItemsActive:pluginState.dataItemsActive,
            dataItems:pluginState.currentDomainItems
        });
    });

    //Listens for requests to add manual extractions as data items
    pluginState.addContentScriptEventHandler(data.contentScriptKey, 'request-add-data-item-target-addin', function (manualExtraction) {
        var newDomainItem = {
            itemValue: manualExtraction.value,
            type: 'manual',
            source: 'manual extraction'
        };
        addDomainItem(newDomainItem, data.contentScriptKey);
    });

    //Listens for requests to get user trailing status
    pluginState.addContentScriptEventHandler(data.contentScriptKey, 'requestPanelActive-target-addin', function (scriptData) {
        pluginState.postEventToContentScript(data.contentScriptKey, 'panelStatus-target-content-script', {panelActive: pluginState.panelActive});
    });

    //Create trail urls
    pluginState.addContentScriptEventHandler(data.contentScriptKey, 'zipped-html-body-target-addin', function (pageContents) {
      //TODO: Work out some scraper eventing so we don't do the DOM operation if we're not trailing.
      //This will work for now though.
      if (!pluginState.trailingActive) {
        return;
      }

      //To prevent scraping ads, we'll only record Trails where the url matches an open tab url
      var urlValid = false;
      for (let tab of tabs){
          if(pageContents.url === tab.url){
              urlValid = true;
          }
      }

      if (urlValid) {
        pluginState.restPost(pluginState.trailsUrlsUrl,
            {
              dwTrailId: pluginState.currentTrail.id
              , url: pageContents.url
              , scrapedContent: pageContents.zippedHtmlBody
              , searchTerms: pageContents.searchTerms
              , userId: pluginState.loggedInUser.id
            }, function (res) {
                //Get the id of the created TrailUrl

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

function getExtractedEntities(url){
    //Get panel contents
    pluginState.getExtractedEntities(url, function (divHtml){
        if (divHtml) {
            //send contents to sidebar
            sidebarWorker.port.emit("sidebarContent",divHtml);
        }
    });
}

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
  var currentDomainId = pluginState.currentDomain.id;
  entType['dwDomainId'] = currentDomainId;

  pluginState.restPost(pluginState.createEntityType,
    entType, function (res) {
      console.log(res.text);
    }
  );
}

function addDomainItem(domItem, activeTabId){
  var currentDomainId = pluginState.currentDomain.id;
  domItem['dwDomainId'] = currentDomainId;
  domItem['userId'] = pluginState.loggedInUser.id;
  var specificDomainInsertUrl =  pluginState.createDomainItem.replace("_domainId_",currentDomainId);
  pluginState.restPost(specificDomainInsertUrl,
      domItem, function (res) {
          console.log(res.text);
      }
  );
  //After creating the new item, make the plugin refresh its list
  pluginState.getDomainItemsForCurrentDomain();

  //Then tell the page to refresh its dataitems
  pluginState.postEventToContentScript(activeTabId, 'refresh-data-items-target-content-script', {
      dataItemsActive: pluginState.dataItemsActive,
      dataItems: pluginState.currentDomainItems
  });
}

function addPageRank(urlObj){
    var pageRankUrl =  pluginState.dwTrailUrlRating;
    pluginState.restPut(pageRankUrl,
        urlObj, function (res) {
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


