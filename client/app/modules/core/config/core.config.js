'use strict';
var app = angular.module('com.module.core');
app.run(function ($rootScope, Setting, gettextCatalog, $window, UserLoginOrLogoutMsg, PluginListenerMsg) {
  //-->browserPlugin.service.js BEGIN
  var browserPluginService = {};
  browserPluginService.pluginOrigin = null;
  browserPluginService.isPluginInstalled = function () {
    return true;
  };
  PluginListenerMsg.listen(function (_event, event) {
    try {
      if (!event || (typeof event !== 'object') || !event.data) {
        return;
      }
      var msg = event.data;
      if (msg.type == 'toolbar-logout') {
        UserLoginOrLogoutMsg.broadcast({action: 'initiate-logout'});
      } else if (msg.type == 'handshake') {
        browserPluginService.pluginOrigin = event.origin;
        var msg = {
          type: 'handshake-ack'
        };
        $window.postMessage(msg, event.origin);
      }
    }
    catch (ex) {
      $window.alert('Could not parse message from plugin: ' + event.data);
    }
  });
  UserLoginOrLogoutMsg.listen(function (_event, msg) {
    browserPluginService.signalPlugin(msg);
  });
  browserPluginService.signalPlugin = function (msg) {
    //$window.alert('Ready to send Login Success message to ' + this.pluginOrigin);
    //Notify plugin using postMessage
    if (!browserPluginService.pluginOrigin) {
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
    $window.postMessage(pluginMsg, browserPluginService.pluginOrigin);
  };
  $window.addEventListener('message', function (event) {
    PluginListenerMsg.broadcast(event);
  });
  //-->browserPlugin.service.js END

  // Left Sidemenu
  $rootScope.menu = [];
  // Add Sidebar Menu
  $rootScope.addMenu = function (name, uisref, icon) {
    $rootScope.menu.push({
      name: name,
      sref: uisref,
      icon: icon
    });
  };
  // Add Menu Dashboard
  $rootScope.addMenu(gettextCatalog.getString('Dashboard'), 'app.home',
    'fa-dashboard');
  // Dashboard
  $rootScope.dashboardBox = [];
  // Add Dashboard Box
  $rootScope.addDashboardBox = function (name, color, icon, quantity, href) {
    $rootScope.dashboardBox.push({
      name: name,
      color: color,
      icon: icon,
      quantity: quantity,
      href: href
    });
  };
  // Get Settings for Database
  $rootScope.setSetting = function (key, value) {
    Setting.find({
      filter: {
        where: {
          key: key
        }
      }
    }, function (data) {
      if (data.length) {
        data[0].value = value;
        data[0].$save();
      } else {
        Setting.create({
          key: key,
          value: value
        }, function (data) {
          console.log(data);
        });
      }
      $rootScope.loadSettings();
    });
  };
  // Load Settings blank
  $rootScope.settings = {};
  // Get Settings for Loopback Service
  $rootScope.loadSettings = function () {
    Setting.find(function (settings) {
      $rootScope.settings.data = settings;
    });
  };
});
app.config(function (formlyConfigProvider) {
  formlyConfigProvider.extras.removeChromeAutoComplete = true;
  //Don't need to do this with formly v.6.x. Using Bootstrap types.
  return;
  var templates = 'modules/core/views/elements/fields/';
  var formly = templates + 'formly-field-';
  var fields = [
    'checkbox',
    'email',
    'hidden',
    'number',
    'password',
    'radio',
    'select',
    'text',
    'textarea'
  ];
  angular.forEach(fields, function (val) {
    formlyConfigProvider.setType({
      name: val,
      templateUrl: formly + val + '.html'
    });
    //formlyConfigProvider.setTemplateUrl(val, formly + val + '.html');
  });
  formlyConfigProvider.setType({
    name: 'date',
    templateUrl: templates + 'date.html'
  });
  //formlyConfigProvider.setTemplateUrl('date', templates + 'date.html');
  formlyConfigProvider.setType({
    name: 'time',
    templateUrl: templates + 'time.html'
  });
  //formlyConfigProvider.setTemplateUrl('time', templates + 'time.html');
});
app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
}]);
