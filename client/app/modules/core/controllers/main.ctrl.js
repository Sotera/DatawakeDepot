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
                                    CoreService, AppAuth, gettextCatalog, AminoUser) {
    //This currentUser is for filling out the Login screen and has nothing to do with
    //whether anyone is logged in
    UserLoginOrLogoutMsg.listen(function (_event, msg) {
      if(msg.action === 'initiate-logout'){
        AppAuth.logout(function () {
          $state.go('login');
          CoreService.toastSuccess(gettextCatalog.getString('Logged out'), gettextCatalog.getString('You are logged out!'));
        });

        //Notify toolbar
        UserLoginOrLogoutMsg.broadcast({action: 'logout'});
      }else if(msg.action === 'logout'){
        $scope.noOneLoggedIn = true;
      }else if(msg.action === 'login'){
        $scope.noOneLoggedIn = false;
      }
    });

    AppAuth.getCurrentUser();
    $scope.currentUser = AminoUser.getCurrent();
    $scope.menuoptions = $rootScope.menu;

    $scope.logout = function () {
        UserLoginOrLogoutMsg.broadcast({action: 'initiate-logout'});
    };
  });
