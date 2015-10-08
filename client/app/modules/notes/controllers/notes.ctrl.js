'use strict';
var app = angular.module('com.module.notes');

app.controller('NotesCtrl', function($scope, $state, $stateParams, NotesService, gettextCatalog) {

  $scope.note = {};
  $scope.formFields = [{
    key: 'title',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Title'),
      required: true
    }
  }, {
    key: 'body',
    type: 'textarea',
    templateOptions: {
      label: gettextCatalog.getString('Body'),
      required: true
    }
  }];

  //$scope.formOptions = {
  //  uniqueFormId: true,
  //  hideSubmit: false,
  //  submitCopy: 'Save'
  //};

  $scope.delete = function(id) {
    NotesService.deleteNote(id, function() {
      $scope.notes = NotesService.getNotes();
    });
  };

  $scope.onSubmit = function() {
    NotesService.upsertNote($scope.note, function() {
      $scope.notes = NotesService.getNotes();
      $state.go('^.list');
    });
  };

  $scope.notes = NotesService.getNotes();

  if ($stateParams.id) {
    NotesService.getNote($stateParams.id).$promise.then(function(result){
      $scope.note = result;})
  } else {
    $scope.note = {};
  }

});

