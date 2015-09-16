angular.module('loopbackApp')
  .service('UserLoginOrLogoutMsg', ['$rootScope', function ($rootScope) {
    this.broadcast = function broadcast() {
      var args = ['UserLoginOrLogoutMsg'];
      Array.prototype.push.apply(args, arguments);
      $rootScope.$broadcast.apply($rootScope, args);
    };
    this.listen = function (callback) {
      $rootScope.$on('UserLoginOrLogoutMsg', callback)
    }
  }]);

