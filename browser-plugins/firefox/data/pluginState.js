var {on, emit} = require('sdk/event/core');
var PluginState = function () {
  var me = this;
  me.loggedInUser = null;
  me.loginUrl = null;
  me.trailingActive = false;
  me.toolbarFrameSource = null;
  me.toolbarFrameOrigin = null;
  me.datawakeDepotContentScriptHandle = null;
  me.scraperContentScriptHandle = null;
  me.pageModDatawakeDepotIncludeFilter = null;
  me.postMessageToToolBar = function (msg) {
    me.toolbarFrameSource.postMessage(msg, me.toolbarFrameOrigin);
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
  me.onScraperContentScriptAttach = function(worker){
    me.scraperContentScriptHandle = worker;
    me.postEventToAddInModule('page-scraper-content-script-attached-target-addin');
    me.postEventToScraperContentScript('page-attached-target-content-script');
  }
  me.onDatawakeDepotContentScriptAttach = function(worker){
    me.datawakeDepotContentScriptHandle = worker;
    me.postEventToAddInModule('page-datawake-depot-content-script-attached-target-addin');
    me.postEventToDatawakeDepotContentScript('page-attached-target-content-script');
  }
};
exports.pluginState = exports.pluginState || new PluginState();
