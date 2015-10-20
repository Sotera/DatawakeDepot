'use strict';
/**
 * @ngdoc function
 * @name com.module.users.controller:LoginCtrl
 * @description Login Controller
 * @requires $scope
 * @requires $routeParams
 * @requires $location
 * Contrller for Login Page
 **/
angular.module('com.module.users')
  .controller('LoginCtrl', function ($scope, $routeParams, $location, UserLoginOrLogoutMsg,
                                     CoreService, AminoUser, AppAuth, AuthProvider, gettextCatalog) {
    var TWO_WEEKS = 1000 * 60 * 60 * 24 * 7 * 2;
    var isFireFox = typeof InstallTrigger !== 'undefined';
    /*    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
     var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
     var isChrome = !!window.chrome && !isOpera;
     var isIE = false || !!document.documentMode;*/
    UserLoginOrLogoutMsg.listen(function () {
      $scope.showDownloadPluginButton = false;
    });
    $scope.showDownloadPluginButton = isFireFox;
    $scope.credentials = {
      ttl: TWO_WEEKS,
      rememberMe: true
    };
    if (CoreService.env.name === 'development') {
      $scope.credentials.email = 'admin@admin.com';
      $scope.credentials.password = 'admin';
    }
    $scope.schema = [{
      label: '',
      property: 'email',
      placeholder: gettextCatalog.getString('Email'),
      type: 'email',
      attr: {
        required: true,
        ngMinlength: 4
      },
      msgs: {
        required: gettextCatalog.getString('You need an email address'),
        email: gettextCatalog.getString('Email address needs to be valid'),
        valid: gettextCatalog.getString('Nice email address!')
      }
    }, {
      label: '',
      property: 'password',
      placeholder: gettextCatalog.getString('Password'),
      type: 'password',
      attr: {
        required: true
      }
    }
      /*      , {
       property: 'rememberMe',
       label: gettextCatalog.getString('Stay signed in'),
       type: 'checkbox'
       }*/
    ];
    $scope.options = {
      validation: {
        enabled: true,
        showMessages: false
      },
      layout: {
        type: 'basic',
        labelSize: 3,
        inputSize: 9
      }
    };
    $scope.socialLogin = function (provider) {
      window.location = CoreService.env.siteUrl + provider.authPath;
    };
    AuthProvider.count(function (result) {
      if (result.count > 0) {
        AuthProvider.find(function (result) {
          $scope.authProviders = result;
        });
      }
    });
    $scope.getPlugin = function () {
      //All we do here is make the 'GetPlugin' button go away
      $scope.showDownloadPluginButton = false;
    };
    $scope.login = function () {
      AminoUser.login({
        include: 'user',
        rememberMe: $scope.credentials.rememberMe
      }, $scope.credentials).$promise
        .then(function (userInfo) {
          var next = $location.nextAfterLogin || '/';
          $location.nextAfterLogin = null;
          AppAuth.currentUser = userInfo.user;
          AppAuth.currentUser.accessToken = userInfo.id;
          //Find a little more out about our current user
          AminoUser.findOne({
            filter: {
              where: {
                id: AppAuth.currentUser.id
              },
              include: ['roles', 'identities', 'credentials', 'accessTokens']
            }
          }).$promise
            .then(function (user) {
              AppAuth.currentUser.roles = user.roles;
              var admins = AppAuth.currentUser.roles.filter(function (u) {
                return u.name === 'admins';
              });
              AppAuth.currentUser.isAdmin = (admins.length > 0);
              //And now toast our login success!
              CoreService.toastSuccess(gettextCatalog.getString('Logged in'),
                gettextCatalog.getString('You are logged in!'));
              if (next === '/login') {
                next = '/';
              }
              $location.path(next);
              var msg = {
                action: 'login',
                user: AppAuth.currentUser
              }
              UserLoginOrLogoutMsg.broadcast(msg);
            })
            .catch(function (err) {
              $scope.loginError = res.data.error;
            });
        })
        .catch(function (err) {
          $scope.loginError = res.data.error;
        });
    };
  });
