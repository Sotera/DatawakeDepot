angular.module('loopbackApp')
  .service('PluginListenerMsg', ['$rootScope', function ($rootScope) {
    this.broadcast = function broadcast() {
      var args = ['PluginListenerMsg'];
      Array.prototype.push.apply(args, arguments);
      $rootScope.$broadcast.apply($rootScope, args);
    };
    this.listen = function (callback) {
      $rootScope.$on('PluginListenerMsg', callback)
    }
  }]);

