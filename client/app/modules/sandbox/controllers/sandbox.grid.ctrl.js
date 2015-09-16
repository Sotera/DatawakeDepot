'use strict';
var app = angular.module('com.module.sandbox');
app.controller('SandboxGridCtrl', function ($scope, Post) {
  var columnDefs =
    [{
      headerName: 'Title',
      field: 'title'
    }];
  $scope.pageSize = '500';
  $scope.gridOptions = {
    columnDefs: columnDefs,
    enableSorting: true,
    enableFilter: true,
    enableColResize: true
  };
  $scope.onPageSizeChanged = function () {
    createNewDatasource();
  };
/*  var allOfTheData;
  $http.get("../olympicWinners.json")
    .then(function (result) {
      allOfTheData = result.data;
      createNewDatasource();
    });*/
  function createNewDatasource() {
    var dataSource = {
      pageSize: parseInt($scope.pageSize),
      getRows: function (params) {
        console.log('asking for ' + params.startRow + ' to ' + params.endRow);
        Post.find(function(posts) {
          //success
          params.successCallback(posts, posts.length);
        }, function(){
          //error
          params.failCallback();
        });
/*        setTimeout(function () {
          var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
          var lastRow = -1;
          if (allOfTheData.length <= params.endRow) {
            lastRow = allOfTheData.length;
          }
          params.successCallback(rowsThisPage, lastRow);
        }, 500);*/
      }
    };
    $scope.gridOptions.api.setDatasource(dataSource);
  }
});
