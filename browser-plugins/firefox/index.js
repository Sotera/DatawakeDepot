var { Toolbar } = require('sdk/ui/toolbar');
var { Frame } = require('sdk/ui/frame');
var tabs = require('sdk/tabs');

//var loggedInUser = null;
//var toolbarFrameSource = null;
var toolbarFrameOrigin = null;
var contentScriptHandle = null;

require('./data/contextMenu').init();

var pluginState = require('./data/pluginState').getPluginState();

var pageMod = require('sdk/page-mod');
pageMod.PageMod({
  include: 'http://localhost:3000/*',
  //include: '*.datawake-depot.org',
  contentScriptFile: './injectedPageScripts/datawake-depot.js',
  attachTo: ['existing', 'top', 'frame'],
  onAttach: function (worker) {
    contentScriptHandle = worker;
    //This listener is waiting to hear from the injected content script
    contentScriptHandle.port.on('logout-success-target-plugin', function (user) {
      pluginState.loggedInUser = null;
      var msg = {
        type: 'logout-success-target-toolbar-frame'
      }
      pluginState.toolbarFrameSource.postMessage(msg, toolbarFrameOrigin);
    });
    contentScriptHandle.port.on('login-success-target-plugin', function (user) {
      pluginState.loggedInUser = user;
      var msg = {
        type: 'login-success-target-toolbar-frame',
        user: user
      }
      pluginState.toolbarFrameSource.postMessage(msg, toolbarFrameOrigin);
    });
    //This message gets emitted from the mainline plugin code to the injected
    //content script
    contentScriptHandle.port.emit('page-attached-target-content-script', '');
  }
});
/*tabs.on('ready', function(tab){
 var t = tab;
 });*/
var frame = new Frame({
  url: './toolbarFrame.html',
  onMessage: (e)=> {
    if (e.data == 'logout') {
      contentScriptHandle.port.emit('logout-target-content-script', '');
    } else if (e.data == 'login') {
      tabs.open({
        url: 'http://localhost:3000'
        //url: 'http://datawake-depot.org'
      });
    } else if (e.data == 'page-loaded') {
      pluginState.toolbarFrameSource = e.source;
      toolbarFrameOrigin = e.origin;
    }
    //e.source.postMessage('pong', e.origin);
  }
});
var toolbar = Toolbar({
  title: 'Datawake',
  items: [frame]
});