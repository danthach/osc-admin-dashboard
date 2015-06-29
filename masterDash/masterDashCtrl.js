angular.module('OSCDashboardApp', ['ngMaterial', 'ServerList'])
  .controller('MasterCtrl', ['$scope', function($scope) {
    
    var _this = this;

    
  
  }])
  .directive('dashboardTemplate', function() {
    return {
       scope: {},
       templateUrl: '/u/213392662/OSCDashboards/masterDash/dashboardTpl.html',
       replace: true,
       controller: 'MasterCtrl',
       controllerAs: 'masterCtrl'
    };
});