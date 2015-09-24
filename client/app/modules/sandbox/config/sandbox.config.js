'use strict';
angular.module('com.module.sandbox')
  .run(function($rootScope) {
    $rootScope.addMenu('Tools - Sandbox', 'app.sandbox.index', 'fa-inbox');
  });
