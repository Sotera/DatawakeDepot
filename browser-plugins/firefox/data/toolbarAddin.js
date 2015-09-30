var {pluginState} = require('./pluginState');
exports.init = function() {
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
          tabs.open({
            url: pluginState.loginUrl
          });
          break;
        case 'logout':
          pluginState.postEventToContentScript('logout-target-content-script');
          break;
        case 'set-trailing-active':
          pluginState.trailingActive = msg.data;
          break;
      }
    }
  });
  var toolbar = Toolbar({
    title: 'Datawake',
    items: [frame]
  });
  tabs.on('ready', function (tab) {
    if (pluginState.trailingActive) {
      var {Request} = require('sdk/request');
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
    }
  });
}

