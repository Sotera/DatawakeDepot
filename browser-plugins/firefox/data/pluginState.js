var {on, emit} = require('sdk/event/core');
var PluginState = function () {
  var me = this;
  me.loggedInUser = null;
  me.loginUrl = null;
  me.trailingActive = false;
  me.toolbarFrameSource = null;
  me.toolbarFrameOrigin = null;
  me.contentScriptHandle = null;
  me.pageModDatawakeDepotIncludeFilter = null;
  me.postMessageToToolBar = function (msg) {
    me.toolbarFrameSource.postMessage(msg, me.toolbarFrameOrigin);
  };
  me.postEventToContentScript = function (eventName, data) {
    if (!me.contentScriptHandle) {
      return;
    }
    me.contentScriptHandle.port.emit(eventName, data);
  };
  me.addContentScriptEventHandler = function (eventName, cb) {
    me.contentScriptHandle.port.on(eventName, cb);
  };
  me.postEventToAddInModule = function (eventName, data) {
    emit(exports, eventName, data);
  };
  me.onAddInModuleEvent = function (eventName, cb) {
    on(exports, eventName, cb);
  };
  me.onContentScriptAttach = function(worker){
    me.contentScriptHandle = worker;
    me.postEventToAddInModule('page-content-script-attached');
    me.postEventToContentScript('page-attached-target-content-script');
  }
};
exports.pluginState = exports.pluginState || new PluginState();
