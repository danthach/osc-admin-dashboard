angular.module('OSCDashboardApp', ['ngMaterial', 'ServerList', 'SharedHTTP'])
  .controller('MasterCtrl', ['$scope', 'HTTPService', '$mdDialog', function($scope, HTTPService, $mdDialog) {
    
    var _this = this;

    this.getUserData = function() {
      var url = '/user/';
      HTTPService.get(url, function(data){
        console.log('this user = ', data);
        if(data.user){
          _this.loggedIn = true;
          _this.user = data.user;
          _this.admin = data.user.admin ? true : false;
          _this.slicedUserEmail = data.user.username.substr(0, data.user.username.indexOf('@'));
        }else{
          _this.loggedIn = false;
          _this.showLogin();
        }
      });
    };
    this.getUserData();

    $scope.$on('loginSuccess', function(event, user) {
      _this.loggedIn = true;
      _this.user = user;
      _this.admin = user.admin ? true : false;
      _this.slicedUserEmail = user.username.substr(0, user.username.indexOf('@'));
    });

    this.showMyProfile = function(event) {
      $mdDialog.show({
        controller: 'MyProfileCtrl',
        templateUrl: 'masterDash/templates/myProfileModal.html',
        parent: angular.element(document.body),
        targetEvent: event,
        locals: {
          user: _this.user
        }
      });
    };

    this.showManageUsers = function(event) {
      $mdDialog.show({
        controller: 'ManageUsersCtrl',
        templateUrl: 'masterDash/templates/manageUsersModal.html',
        parent: angular.element(document.body),
        targetEvent: event
      });
    };

    this.showLogin = function(event) {
      $mdDialog.show({
        controller: 'LoginCtrl',
        templateUrl: 'masterDash/templates/loginModal.html',
        parent: angular.element(document.body),
        targetEvent: event,
      });
    };

    this.logout = function() {
      this.loggedIn = false;
      var url = '/logout/';
        HTTPService.get(url, function(data){
          _this.showLogin();
        });
    };
  
  }])
  .controller('MyProfileCtrl',['$scope', 'HTTPService', '$mdDialog', '$mdToast', 'user', 
    function($scope, HTTPService, $mdDialog, $mdToast, user) {

      $scope.user = user;
      $scope.passwordsMatch = true;

      $scope.close = function() {
        $mdDialog.hide();
      };

      $scope.saveMyProfile = function(pw) {
        if(!pw){
          $mdDialog.hide()
        }else{
          if(pw.first == pw.second){
            $scope.passwordsMatch = true;

            var url = '/changePassword/';
            pw.userId = $scope.user._id;
            HTTPService.post(pw, url, function(success){
                var status = success ? 'Success changing password' : 'Failure changing password';
                console.log(status);
                if(success){
                  $scope.pw = '';
                  $mdToast.show(
                    $mdToast.simple()
                      .content('Success! Password Changed.')
                      .position('top right')
                      .hideDelay(3000)
                  );
                  $mdDialog.hide();
                }
            });
          }else{
            $scope.passwordsMatch = false;
          }
        }

      };

  }])
  .controller('ManageUsersCtrl',['$scope', '$mdDialog', '$mdToast', 'HTTPService', 
    function($scope, $mdDialog, $mdToast, HTTPService) {

      $scope.close = function() {
        $mdDialog.hide();
      };

      $scope.getUserList = function() {
        var url = '/userList/';
        HTTPService.get(url, function(data){
          console.log('User List = ', data);
          $scope.users = data;
        });
      };
      $scope.getUserList();

      $scope.createUser = function(newUser) {
        var url = '/createUser/';
        HTTPService.post(newUser, url, function(success, data){
            var status = success ? 'Success creating user' : 'Failure creating user';
            console.log(status);
            if(data.userAlreadyExists) {
              $scope.userAlreadyExists = true;
            }else{
              $scope.toasterMsg('Success! User Created.');
              $scope.userAlreadyExists = false;
              $scope.showNewUserForm = false;
              $scope.newUser = '';
              $scope.getUserList();
            }
        });
      };

      $scope.deleteUser = function(event, userId) {
        event.stopPropagation();
        var msg = "Are you sure you want to delete this user? This can't be undone.";
        if( !window.confirm(msg) ){return}
        var url = '/deleteUser/';
        HTTPService.deleteItem(userId, url, function(success){
            var status = success ? 'This product has been deleted.' : 'There was a problem deleting this product';
            console.log(status);
            $scope.toasterMsg('Success! User Deleted.');
            $scope.getUserList();
        });
      }

      $scope.toasterMsg = function(msg) {
        $mdToast.show(
          $mdToast.simple()
            .content(msg)
            .position('top right')
            .hideDelay(3000)
        );
      };

  }])
  .controller('LoginCtrl',['$scope', '$rootScope', '$mdDialog', '$mdToast', 'HTTPService', 
    function($scope, $rootScope, $mdDialog, $mdToast, HTTPService) {

      $scope.close = function() {
        $mdDialog.hide();
      };

      $scope.login = function(user) {
        var url = '/login/';
        HTTPService.post(user, url, function(success, data){
            console.log('Login Data = ', data);
            var status = success ? 'Success logging in' : 'Failure logging in';
            console.log(status);
            if(!data.error){
              $scope.failedLogin = false;
              $scope.close();
              $scope.toasterMsg('Welcome ' + data.username);
              $rootScope.$broadcast('loginSuccess', data);
            }else{
              $scope.failedLogin = true;
              console.log('invalid credentials - try again');
            }
        });
      };

      $scope.toasterMsg = function(msg) {
        $mdToast.show(
          $mdToast.simple()
            .content(msg)
            .position('top right')
            .hideDelay(3000)
        );
      };

  }])
  .directive('dashboardTemplate', function() {
    return {
       scope: {},
       templateUrl: 'masterDash/templates/dashboardTpl.html',
       replace: true,
       controller: 'MasterCtrl',
       controllerAs: 'masterCtrl'
    };
});