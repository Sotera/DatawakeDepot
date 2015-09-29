exports.init = init;
var pluginState = require('./pluginState').getPluginState();
function init() {
  var tabs = require('sdk/tabs');
  var { Toolbar } = require('sdk/ui/toolbar');
  var { Frame } = require('sdk/ui/frame');
  var frame = new Frame({
    url: './toolbarFrame.html',
    onMessage: (e)=> {
      var msg = e.data;
      //This msg comes from the system
      if (msg == 'page-loaded') {
        pluginState.toolbarFrameSource = e.source;
        pluginState.toolbarFrameOrigin = e.origin;
        return;
      }
      //These come from us
      switch (msg.action) {
        case 'login':
          tabs.open({
            url: pluginState.loginUrl
          });
          break;
        case 'logout':
          pluginState.contentScriptHandle.port.emit('logout-target-content-script', '');
          break;
        case 'set-trailing-active':
          pluginState.trailingActive = msg.data;
          break;
      }
      //e.source.postMessage('pong', e.origin);
    }
  });
  var toolbar = Toolbar({
    title: 'Datawake',
    items: [frame]
  });
  tabs.on('ready', function (tab) {
    if (pluginState.trailingActive) {
      var {Request} = require('sdk/request');
      Request({
        url: 'http://www.yahoo.com',
        onComplete: function(res){
          console.log(res.text);
        }
      }).get();
    }
  });
}
