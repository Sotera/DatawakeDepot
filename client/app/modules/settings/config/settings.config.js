'use strict';
angular.module('com.module.settings')
  .run(function($rootScope, gettextCatalog) {
    //$rootScope.addMenu(gettextCatalog.getString('Tools - Depot Settings'), 'app.settings.list', 'fa-cog');

    $rootScope.getSetting = function(key) {
      var valor = '';
      angular.forEach($rootScope.settings.data, function(item) {
        if (item.key === key) {
          valor = item.value;
        }
      });
      return valor;
    };

    //$rootScope.getCollapsedStatus = function(){
    //    if(angular.element('.left-side.sidebar-offcanvas.collapse-left').length >0){
    //        return("collapse-left");
    //    }
    //}
    //
    $rootScope.getStretchedStatus = function(){
        if(angular.element('.left-side.sidebar-offcanvas.collapse-left').length >0){
            return("strech");
        }
    }

  });
