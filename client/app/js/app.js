'use strict';
/**
 * @ngdoc overview
 * @name loopbackApp
 * @description
 * # loopbackApp
 *
 * Main module of the application.
 *
 *** The order of the modules here controls the order that they appear in the toolbar on the left of the application ***
 */
angular.module('loopbackApp', [
  'angular-loading-bar',
  'angular.filter',
  'angularBootstrapNavTree',
  'angularFileUpload',
  'btford.markdown',
  'oitozero.ngSweetAlert',
  'config',
  'formly',
  'formlyBootstrap',
  'lbServices',
  'monospaced.elastic',
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ui.bootstrap',
  'ui.codemirror',
  'ui.gravatar',
  'ui.grid',
/*  'angularGrid',*/
  'smart-table',
  'ui.router',
  'ui.layout',
  'toasty',
  'autofields',
  'gettext',
  'com.module.core',
  'com.module.about',
  /*  'com.module.files',
   'com.module.events',
  'com.module.notes',
  'com.module.pages',
  'com.module.posts',
  'com.module.products',

*/
  'com.module.sandbox',
  'com.module.settings',

  'com.module.dwSettings',
  'com.module.users',
  'com.module.dwTeams',
  'com.module.dwDomains',
  'com.module.dwDomainEntityTypes',
  'com.module.dwDomainItems',
  'com.module.dwCrawlTypes',
  'com.module.dwServiceTypes',
  'com.module.dwExtractors',
  'com.module.dwFeeds',

  'com.module.dwTrails',
  'com.module.dwTrailUrls',
  'com.module.dwUrlExtractions'








])
  .run(function ($rootScope, $cookies, gettextCatalog) {
    $rootScope.locales = {
      'de': {
        lang: 'de',
        country: 'DE',
        name: gettextCatalog.getString('German')
      },
      'en': {
        lang: 'en',
        country: 'US',
        name: gettextCatalog.getString('English')
      },
      'fr': {
        lang: 'fr',
        country: 'FR',
        name: gettextCatalog.getString('Français')
      },
      'nl': {
        lang: 'nl',
        country: 'NL',
        name: gettextCatalog.getString('Dutch')
      },
      'pt-BR': {
        lang: 'pt_BR',
        country: 'BR',
        name: gettextCatalog.getString('Portuguese Brazil')
      },
      'ru_RU': {
        lang: 'ru_RU',
        country: 'RU',
        name: gettextCatalog.getString('Russian')
      }
    }
    var lang = $cookies.lang || navigator.language || navigator.userLanguage;
    $rootScope.locale = $rootScope.locales[lang];
    if ($rootScope.locale === undefined) {
      $rootScope.locale = $rootScope.locales[lang];
      if ($rootScope.locale === undefined) {
        $rootScope.locale = $rootScope.locales['en'];
      }
    }
    gettextCatalog.setCurrentLanguage($rootScope.locale.lang);
  });
