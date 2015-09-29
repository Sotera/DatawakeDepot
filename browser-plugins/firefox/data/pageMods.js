exports.init = init;
var pluginState = require('./pluginState').getPluginState();
var {on, emit} = require('sdk/event/core');
function init() {
  var pageMod = require('sdk/page-mod');
  try {
    pageMod.PageMod({
      include: pluginState.pageModDatawakeDepotIncludeFilter,
      contentScriptFile: './injectedPageScripts/datawake-depot.js',
      attachTo: ['existing', 'top', 'frame'],
      onAttach: function (worker) {
        pluginState.contentScriptHandle = worker;
        //This listener is waiting to hear from the injected content script
        pluginState.contentScriptHandle.port.on('logout-success-target-plugin', function (user) {
          //Notify the contextMenu
          emit(exports, 'logged-out-target-context-menu');
          //Notify the toolbarFrame
          pluginState.loggedInUser = null;
          var msg = {
            type: 'logout-success-target-toolbar-frame'
          }
          pluginState.toolbarFrameSource.postMessage(msg, pluginState.toolbarFrameOrigin);
        });
        pluginState.contentScriptHandle.port.on('login-success-target-plugin', function (user) {
          //Notify the contextMenu
          emit(exports, 'logged-in-target-context-menu');
          //Notify the toolbarFrame
          pluginState.loggedInUser = user;
          var msg = {
            type: 'login-success-target-toolbar-frame',
            user: user
          }
          pluginState.toolbarFrameSource.postMessage(msg, pluginState.toolbarFrameOrigin);
        });
        //This message gets emitted from the mainline plugin code to the injected
        //content script
        pluginState.contentScriptHandle.port.emit('page-attached-target-content-script', '');
      }
    });
  }
  catch (err) {
    console.log(err);
  }
};
exports.on = on.bind(null, exports);