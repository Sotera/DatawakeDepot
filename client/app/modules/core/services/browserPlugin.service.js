'use strict';
var app = angular.module('com.module.core');
app.service('BrowserPluginService', ['ENV', '$window', 'UserLoginOrLogoutMsg',
  function (ENV, $window, UserLoginOrLogoutMsg) {
    var me = this;
    me.env = ENV;
    me.pluginOrigin = null;
    me.isPluginInstalled = function () {
      return true;
    };
    UserLoginOrLogoutMsg.listen(function (_event, event) {
      try {
        if(!event || (typeof event !== 'object') || !event.data){
          return;
        }
        var msg = event.data;
        if (msg.type == 'handshake') {
          me.pluginOrigin = event.origin;
          var msg = {
            type: 'handshake-ack'
          }
          $window.postMessage(msg, event.origin);
        }
      }
      catch (ex) {
        $window.alert('Could not parse message: ' + event.data);
      }
    });
    me.notifyPluginOfLoginSuccess = function (user) {
      //$window.alert('Ready to send Login Success message to ' + this.pluginOrigin);
      if (!me.pluginOrigin) {
        //If not in FireFox just let people know a login or out occurred
        UserLoginOrLogoutMsg.broadcast(true);
        return;
      }
      var msg = {
        type: 'login-success-target-content-script',
        user: user
      }
      $window.postMessage(msg, me.pluginOrigin);
    }
    $window.addEventListener('message', function (event) {
      UserLoginOrLogoutMsg.broadcast(event);
    });
  }]);


