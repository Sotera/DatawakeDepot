'use strict';
var app = angular.module('com.module.users');
app.controller('UsersCtrl', function ($scope, $stateParams, $state, CoreService,
                                      AminoUser, Role, AppAuth, gettextCatalog) {
  //Define a couple of scope methods
  $scope.delete = function (id) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function () {
        AminoUser.deleteById(id, function () {
            CoreService.toastSuccess(gettextCatalog.getString(
              'User deleted'), gettextCatalog.getString(
              'Your user is deleted!'));
            $state.go('app.users.list');
          },
          function (err) {
            CoreService.toastError(gettextCatalog.getString(
              'Error deleting user'), gettextCatalog.getString(
              'Your user is not deleted:' + err));
          });
      },
      function () {
        return false;
      });
  };
  $scope.onSubmit = function () {
    var newUser = {
      email: $scope.user.email,
      firstName: $scope.user.firstName,
      lastName: $scope.user.lastName,
      username: $scope.user.email,
      password: $scope.user.password
    };
    AminoUser.create(newUser).$promise
      .then(function (newUser) {
        CoreService.toastSuccess('New user created.', newUser.username);
        var newUserId = newUser.id;
        for (var i = 0; i < $scope.user.memberRoles.length; ++i) {
          var role = $scope.user.memberRoles[i];
          for (var j = 0; j < $scope.displayRoles.length; ++j) {
            if (role === $scope.displayRoles[j].name) {
              var roleId = $scope.displayRoles[j].id;
              AminoUser.addRole({userId: newUserId, roleId: roleId}, function (role) {
                CoreService.toastSuccess('Role added: ' + role.name);
              });
              break;
            }
          }
        }
        $state.go('^.list');
      })
      .catch(function (err) {
        console.log(err);
        CoreService.toastError('Error creating user: ' + newUser.username, err);
        $state.go('^.list');
      });
  };

  //Put the currentUser in $scope for convenience
  $scope.currentUser = AppAuth.currentUser;
  //Put displayRoles in $scope
  $scope.displayRoles = [];
  $scope.user = {};
  $scope.user.memberRoles = [];

  //Setup formly fields for add & edit routes
  $scope.formFields = [{
    key: 'email',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Username'),
      disabled: true
    }
  }, {
    key: 'email',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('E-mail'),
      type: 'email',
      required: true
    }
  }, {
    key: 'firstName',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('First name'),
      required: true
    }
  }, {
    key: 'lastName',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Last name'),
      required: true
    }
  }, {
    key: 'password',
    type: 'input',
    templateOptions: {
      type: 'password',
      label: 'Password',
      required: true
    }
  }, {
    key: 'memberRoles',
    type: 'multiCheckbox',
    templateOptions: {
      label: 'Roles',
      options: $scope.displayRoles,
      disabled: !$scope.currentUser.isAdmin
    }
  }];
  Role.find().$promise
    .then(function (allRoles) {
      for (var i = 0; i < allRoles.length; ++i) {
        $scope.displayRoles.push({
          value: allRoles[i].name,
          name: allRoles[i].name,
          id: allRoles[i].id
        });
      }
      $scope.loading = true;
      AminoUser.find({filter: {include: ['roles']}}).$promise
        .then(function (allUsers) {
          $scope.safeDisplayedUsers = allUsers;
          $scope.displayedUsers = [].concat($scope.safeDisplayedUsers);
          //if $stateParams.id is defined we will be editing an existing user.
          //Otherwise creating a new user
          if ($stateParams.id) {
            AminoUser.find(
              {
                filter: {
                  where: {
                    id: $stateParams.id
                  },
                  include: ['roles', 'identities', 'credentials', 'accessTokens']
                }
              }
            ).$promise
              .then(function (selectedUserArray) {
                if (selectedUserArray.length !== 1) {
                  return;
                }
                $scope.user = selectedUserArray[0];
                $scope.user.memberRoles = [];
                for (var i = 0; i < $scope.displayRoles.length; ++i) {
                  for (var j = 0; j < $scope.user.roles.length; ++j) {
                    if ($scope.user.roles[j].name === $scope.displayRoles[i].name) {
                      $scope.user.memberRoles.push($scope.displayRoles[i].name);
                      break;
                    }
                  }
                }
              })
              .catch(function (err) {
                console.log(err);
              });
          }else{
            //Hack to get around some sort of formly bug
            //$scope.user.password = $scope.user.lastName = ' ';
          }
        })
        .catch(function (err) {
          console.log(err);
        })
        .then(function () {
          $scope.loading = false;
        });
    })
    .catch(function (err) {
      console.log(err);
    });
  return;
  //Dual list management for Roles/Teams
  //http://www.bootply.com/mRcBel7RWm
  var userData = [
    {id: 1, firstName: 'Mary', lastName: 'Goodman', approved: true, points: 34},
    {id: 2, firstName: 'Mark', lastName: 'Wilson', approved: true, points: 4},
    {id: 3, firstName: 'Alex', lastName: 'Davies', approved: true, points: 56},
    {id: 4, firstName: 'Bob', lastName: 'Banks', approved: false, points: 14},
    {id: 5, firstName: 'David', lastName: 'Stevens', approved: false, points: 100},
    {id: 6, firstName: 'Jason', lastName: 'Durham', approved: false, points: 0},
    {id: 7, firstName: 'Jeff', lastName: 'Marks', approved: true, points: 8},
    {id: 8, firstName: 'Betty', lastName: 'Abercrombie', approved: true, points: 18},
    {id: 9, firstName: 'Krista', lastName: 'Michaelson', approved: true, points: 10},
    {id: 11, firstName: 'Devin', lastName: 'Sumner', approved: false, points: 3},
    {id: 12, firstName: 'Navid', lastName: 'Palit', approved: true, points: 57},
    {id: 13, firstName: 'Bhat', lastName: 'Phuart', approved: false, points: 314},
    {id: 14, firstName: 'Nuper', lastName: 'Galzona', approved: true, points: 94}
  ];
  $scope.getRoles = function () {
    return [];
  };
  $scope.roleChecked = function (role, checked) {
    var r = role;
  };
  $scope.selectedA = [];
  $scope.selectedB = [];
  $scope.listA = userData.slice(0, 5);
  $scope.listB = userData.slice(6, 10);
  $scope.items = userData;
  $scope.checkedA = false;
  $scope.checkedB = false;
  function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
      if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
  }

  $scope.aToB = function () {
    for (var i in $scope.selectedA) {
      var moveId = arrayObjectIndexOf($scope.items, $scope.selectedA[i], "id");
      $scope.listB.push($scope.items[moveId]);
      var delId = arrayObjectIndexOf($scope.listA, $scope.selectedA[i], "id");
      $scope.listA.splice(delId, 1);
    }
    reset();
  };
  $scope.bToA = function () {
    for (var i in $scope.selectedB) {
      var moveId = arrayObjectIndexOf($scope.items, $scope.selectedB[i], "id");
      $scope.listA.push($scope.items[moveId]);
      var delId = arrayObjectIndexOf($scope.listB, $scope.selectedB[i], "id");
      $scope.listB.splice(delId, 1);
    }
    reset();
  };
  function reset() {
    $scope.selectedA = [];
    $scope.selectedB = [];
    $scope.toggle = 0;
  }

  $scope.toggleA = function () {
    if ($scope.selectedA.length > 0) {
      $scope.selectedA = [];
    }
    else {
      for (var i in $scope.listA) {
        $scope.selectedA.push($scope.listA[i].id);
      }
    }
  }
  $scope.toggleB = function () {
    if ($scope.selectedB.length > 0) {
      $scope.selectedB = [];
    }
    else {
      for (var i in $scope.listB) {
        $scope.selectedB.push($scope.listB[i].id);
      }
    }
  }
  $scope.selectA = function (i) {
    $scope.selectedA.push(i);
  };
  $scope.selectB = function (i) {
    $scope.selectedB.push(i);
  };
});
