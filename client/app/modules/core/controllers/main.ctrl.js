'use strict';
/**
 * @ngdoc function
 * @name com.module.core.controller:MainCtrl
 * @description Login Controller
 * @requires $scope
 * @requires $state
 * @requires $location
 * @requires CoreService
 * @requires User
 * @requires gettextCatalog
 **/
angular.module('com.module.core')
  .controller('MainCtrl', function ($scope, $rootScope, $state, $location, UserLoginOrLogoutMsg,
                                    CoreService, AminoUser, AppAuth, gettextCatalog) {
    //This currentUser is for filling out the Login screen and has nothing to do with
    //whether anyone is logged in
    UserLoginOrLogoutMsg.listen(function (_event, param) {
      if(typeof param === 'object'){
        return;
      }
      $scope.noOneLoggedIn = !param;
    });
    $scope.currentUser = AminoUser.getCurrent();
    //We have to call AppAuth to see if anyone is logged in
    $scope.noOneLoggedIn = !AppAuth.currentUser;
    $scope.menuoptions = $rootScope.menu;
    $scope.logout = function () {
      AminoUser.logout(function () {
        UserLoginOrLogoutMsg.broadcast(false);
        $state.go('login');
        CoreService.toastSuccess(gettextCatalog.getString('Logged out'),
          gettextCatalog.getString('You are logged out!'));
      });
    };
  });
