'use strict';
var app = angular.module('com.module.core');
app.service('BrowserPluginService', ['ENV', '$window', 'UserLoginOrLogoutMsg', 'PluginListenerMsg',
  function (ENV, $window, UserLoginOrLogoutMsg, PluginListenerMsg) {
    var me = this;
    me.env = ENV;
    me.pluginOrigin = null;
    me.isPluginInstalled = function () {
      return true;
    };
    PluginListenerMsg.listen(function (_event, event) {
      try {
        if (!event || (typeof event !== 'object') || !event.data) {
          return;
        }
        var msg = event.data;
        if (msg.type == 'logout') {
          UserLoginOrLogoutMsg.broadcast({action: 'initiate-logout'});
        } else if (msg.type == 'handshake') {
          me.pluginOrigin = event.origin;
          var msg = {
            type: 'handshake-ack'
          }
          $window.postMessage(msg, event.origin);
        }
      }
      catch (ex) {
        $window.alert('Could not parse message from plugin: ' + event.data);
      }
    });
    UserLoginOrLogoutMsg.listen(function (_event, msg) {
      me.signalPlugin(msg);
    });
    me.signalPlugin = function (msg) {
      //$window.alert('Ready to send Login Success message to ' + this.pluginOrigin);
      //Notify plugin using postMessage
      if (!me.pluginOrigin) {
        return;
      }
      var pluginMsg = {type: 'none'};
      if (msg.action === 'login') {
        pluginMsg = {
          type: 'login-success-target-content-script',
          user: msg.user
        }
      } else if (msg.action === 'logout') {
        pluginMsg = {
          type: 'logout-success-target-content-script'
        }
      }
      $window.postMessage(pluginMsg, me.pluginOrigin);
    };
    $window.addEventListener('message', function (event) {
      PluginListenerMsg.broadcast(event);
    });
  }]);


