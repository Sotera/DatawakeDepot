exports.init = init;
var pluginState = require('./pluginState').getPluginState();
function init() {
  var tabs = require('sdk/tabs');
  var { Toolbar } = require('sdk/ui/toolbar');
  var { Frame } = require('sdk/ui/frame');
  var frame = new Frame({
    url: './toolbarFrame.html',
    onMessage: (e)=> {
      if (e.data == 'logout') {
        pluginState.contentScriptHandle.port.emit('logout-target-content-script', '');
      } else if (e.data == 'login') {
        tabs.open({
          url: pluginState.loginUrl
        });
      } else if (e.data == 'page-loaded') {
        pluginState.toolbarFrameSource = e.source;
        pluginState.toolbarFrameOrigin = e.origin;
      }
      //e.source.postMessage('pong', e.origin);
    }
  });
  var toolbar = Toolbar({
    title: 'Datawake',
    items: [frame]
  });
  /*tabs.on('ready', function(tab){
   var t = tab;
   });*/
}
