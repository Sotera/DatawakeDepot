var { ActionButton } = require('sdk/ui/button/action');
var { Toolbar } = require('sdk/ui/toolbar');
var { Frame } = require('sdk/ui/frame');
var tabs = require('sdk/tabs');
var pageMod = require('sdk/page-mod');
//var self = require('sdk/self');
var loggedInUser = null;
var toolbarFrameSource = null;
var toolbarFrameOrigin = null;
/*tabs.on('ready', function(tab){
 var t = tab;
 });*/

/*pageMod.PageMod({
 include: '*',
 contentScriptFile: './injectedPageScripts/datawake-depot.js',
 attachTo: ['existing','top','frame'],
 onAttach: function(worker){
 worker.port.emit('replacePage', 'Gundlach Bundshuh!')
 }
 });*/
pageMod.PageMod({
  //include: 'http://reeme-pc:3000/*',
  include: 'http://localhost:3000/*',
  //include: '*.datawake-depot.org',
  contentScriptFile: './injectedPageScripts/datawake-depot.js',
  //attachTo: ['existing'],
  attachTo: ['existing', 'top', 'frame'],
  onAttach: function (worker) {
    //This listener is waiting to hear from the injected content script
    worker.port.on('login-success-target-plugin', function (user) {
      loggedInUser = user;
      var msg = {
        type: 'login-success-target-toolbar-frame'
      }
      toolbarFrameSource.postMessage(msg, toolbarFrameOrigin);
    });
    //This message gets emitted from the mainline plugin code to the injected
    //content script
    worker.port.emit('page-attached-target-content-script', '');
  }
});
var frame = new Frame({
  url: './toolbarFrame.html',
  onMessage: (e)=> {
    if (e.data == 'login') {
      tabs.open({
        //url: 'http://reeme-pc:3000'
        url: 'http://localhost:3000'
        //url: 'http://datawake-depot.org'
      });
    } else if (e.data == 'page-loaded') {
/*      tabs.open({
        url: 'http://www.yahoo.com'
      });*/
      toolbarFrameSource = e.source;
      toolbarFrameOrigin = e.origin;
    }
    //e.source.postMessage('pong', e.origin);
  }
});
var toolbar = Toolbar({
  title: 'Datawake',
  items: [frame]
});