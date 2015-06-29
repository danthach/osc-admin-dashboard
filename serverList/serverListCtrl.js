angular.module('ServerList', ['SharedHTTP'])
  .controller('ServerListCtrl', ['$scope', '$mdBottomSheet', 'HTTPService', function($scope, $mdBottomSheet, HTTPService) {
    
    var _this = this;

    this.getServerData = function() {
      var url = '/u/213392662/OSCDashboards/servers.json';
      HTTPService.get(url, function(data){
        _this.allServers = data;
        console.log('server data = ', data);
      });
    };
    this.getServerData();

    this.showBottomSheet = function($event, index) {
      $mdBottomSheet.show({
        templateUrl: '/u/213392662/OSCDashboards/serverList/serverListBottomSheet.html',
        controller: 'ServerListBottomSheetCtrl',
        targetEvent: $event, 
        locals: {
          modules: _this.modules,
          thisServer: _this.servers[index]
        }
      });
    };

    this.serverStatusImg = function(index) {
      var thisServer = this.servers[index];
      if(thisServer.serverStatus == 3){
        return { "background": "url(/u/213392662/OSCDashboards/img/server-ok-sm.png) no-repeat", "background-size": "cover" };
      } else if(thisServer.sserverStatus == 2) {
        return { "background": "url(/u/213392662/OSCDashboards/img/server-warn-sm.png) no-repeat", "background-size": "cover" };
      } else if(thisServer.serverStatus == 1){
        return { "background": "url('/u/213392662/OSCDashboards/img/server-err-sm.png') no-repeat", "background-size": "cover" };
      } 
    };

    this.servers = [
      {
        name: "Server One",
        host: "uatfms.amsoscar.com",
        roles: ["Full Stack", "Clips"],
        ip: "76.120.70.39",
        uptime: "36d 8h 29m",
        diskUsage: "38%",
        status: 3,
        executions: [
              {execId: 1433276102578, status: 'OK', steps: [
                {label: 'Create Media Directories', status: 'OK', tasks: [
                  {id: 'fileManager', status: 'OK', error: 'This is the task error output - its very informative, right?'}
                ]},
                {label: 'Live Encode', status: 'OK', tasks: [
                  {id: 'encoder', status: 'OK', error: 'This is the task error output - its very informative, right?'},
                  {id: 'nttpNotifier', status: 'OK', error: 'This is the task error output - its very informative, right?'}
                ]},
                {label: 'Upload Stream and Create Spritesheet', status: 'OK', tasks: [
                  {id: 'fileManager', status: 'OK', error: 'This is the task error output - its very informative, right?'},
                  {id: 'imgProcessor', status: 'OK', error: 'This is the task error output - its very informative, right?'},
                  {id: 'httpNotifier', status: 'OK', error: 'This is the task error output - its very informative, right?'}
                ]},
                {label: 'Upload VTT', status: 'OK', tasks: [
                  {id: 'encoder', status: 'OK', error: 'This is the task error output - its very informative, right?'},
                  {id: 'nttpNotifier', status: 'OK', error: 'This is the task error output - its very informative, right?'}
                ]},
                {label: 'Upload Thumbnails', status: 'OK', tasks: [
                  {id: 'fileManager', status: 'OK', error: 'This is the task error output - its very informative, right?'},
                  {id: 'imgProcessor', status: 'OK', error: 'This is the task error output - its very informative, right?'},
                  {id: 'httpNotifier', status: 'OK', error: 'This is the task error output - its very informative, right?'}
                ]},
                {label: 'Upload Thumbnails', status: 'OK', tasks: [
                  {id: 'encoder', status: 'OK', error: 'This is the task error output - its very informative, right?'},
                  {id: 'nttpNotifier', status: 'OK', error: 'This is the task error output - its very informative, right?'}
                ]}
              ]},
              {execId: 1433276141541, status: 'OK'},
              {execId: 1433276104647, status: 'OK'},
              {execId: 1433276102578, status: 'OK'},
            ]
      },
      {
        name: "Server Two",
        host: "uatfms.amsoscar.com",
        roles: ["Live", "Encode"],
        ip: "76.120.70.39",
        uptime: "36d 8h 29m",
        diskUsage: "38%",
        status: 1,
        executions: [
              {execId: 1433276102578, status: 'OK'},
              {execId: 1433276141541, status: 'OK'},
              {execId: 1433276104647, status: 'OK'},
              {execId: 1433276102578, status: 'OK'},
            ]
      },
      {
        name: "Server Three",
        host: "uatfms.amsoscar.com",
        roles: ["Full Stack", "Clips"],
        ip: "76.120.70.39",
        uptime: "36d 8h 29m",
        diskUsage: "38%",
        status: 3,
        executions: [
              {execId: 1433276102578, status: 'OK'},
              {execId: 1433276141541, status: 'OK'},
              {execId: 1433276104647, status: 'OK'},
              {execId: 1433276102578, status: 'OK'},
            ]
      },
      {
        name: "Server Four",
        host: "uatfms.amsoscar.com",
        roles: ["Clips"],
        ip: "76.120.70.39",
        uptime: "36d 8h 29m",
        diskUsage: "38%",
        status: 3,
        executions: [
              {execId: 1433276102578, status: 'OK'},
              {execId: 1433276141541, status: 'OK'},
              {execId: 1433276104647, status: 'OK'},
              {execId: 1433276102578, status: 'OK'},
            ]
      },
      {
        name: "Server Five",
        host: "uatfms.amsoscar.com",
        roles: ["Full Stack", "Clips", "Live Encode"],
        ip: "76.120.70.39",
        uptime: "36d 8h 29m",
        diskUsage: "38%",
        status: 1,
        executions: [
              {execId: 1433276102578, status: 'OK'},
              {execId: 1433276141541, status: 'OK'},
              {execId: 1433276104647, status: 'OK'},
              {execId: 1433276102578, status: 'OK'},
            ]
      },
      {
        name: "Server Six",
        host: "uatfms.amsoscar.com",
        roles: ["Full Stack", "Clips"],
        ip: "76.120.70.39",
        uptime: "36d 8h 29m",
        diskUsage: "38%",
        status: 2,
        executions: [
              {execId: 1433276102578, status: 'OK'},
              {execId: 1433276141541, status: 'OK'},
              {execId: 1433276104647, status: 'OK'},
              {execId: 1433276102578, status: 'OK'},
            ]
      },
      {
        name: "Server Seven",
        host: "uatfms.amsoscar.com",
        roles: ["Full Stack"],
        ip: "76.120.70.39",
        uptime: "36d 8h 29m",
        diskUsage: "38%",
        status: 1,
        executions: [
              {execId: 1433276102578, status: 'OK'},
              {execId: 1433276141541, status: 'OK'},
              {execId: 1433276104647, status: 'OK'},
              {execId: 1433276102578, status: 'OK'},
            ]
      }
    ];

    this.modules = [
          {
            moduleName: "module name 1", 
            status: "ok",
            completedTasks: 78,
            inProgressTasks: 2,
            inQueueTasks: 23,
            erroredTasks: 0
          },
          {
            moduleName: "module name 2",
            status: "ok", 
          },
          {
            moduleName: "module name 3", 
            status: "warn",
          },
          {
            moduleName: "module name 4", 
            status: "err",
          },
          {
            moduleName: "module name 5", 
            status: "ok",
          },
          {
            moduleName: "module name 6", 
            status: "ok",
          },
          {
            moduleName: "module name 7", 
            status: "ok",
          }
        ];
  
  }])
  .controller('ServerListBottomSheetCtrl',['$scope', '$mdBottomSheet', '$mdDialog', 'modules', 'thisServer', 
    function($scope, $mdBottomSheet, $mdDialog, modules, thisServer) {
    
    $scope.server = thisServer;
    $scope.modules = modules;

    $scope.closeBottomSheet = function() {
      $mdBottomSheet.hide();
    };

    $scope.moduleStatusImg = function(index) {
      if($scope.modules[index].status == 'ok'){
        return { "background": "url(/u/213392662/OSCDashboards/img/server-ok-sm.png) no-repeat", "background-size": "cover" };
      } else if($scope.modules[index].status == 'warn') {
        return { "background": "url(/u/213392662/OSCDashboards/img/server-warn-sm.png) no-repeat", "background-size": "cover" };
      } else if($scope.modules[index].status == 'err'){
        return { "background": "url('/u/213392662/OSCDashboards/img/server-err-sm.png') no-repeat", "background-size": "cover" };
      } 
    };

    // $scope.selectModule = function(index) {
    //   $scope.thisModule = $scope.server.modules[index];
    //   $scope.thisExecution = undefined;
    //   $scope.thisStep = undefined;
    //   $scope.thisTask = undefined;
    // };

    $scope.selectExecution = function(index) {
      $scope.thisExecution = $scope.server.executions[index];
      $scope.thisStep = undefined;
      $scope.thisTask = undefined;
    };

    $scope.selectStep = function(index) {
      $scope.thisStep = $scope.thisExecution.steps[index];
      $scope.thisTask = undefined;
    };

    $scope.showModuleDetails = function(event, index) {
      $scope.thisModule = $scope.modules[index];

      $mdDialog.show({
        controller: 'ModuleDetailsModalCtrl',
        templateUrl: '/u/213392662/OSCDashboards/serverList/moduleDetailsModal.html',
        parent: angular.element(document.body),
        targetEvent: event,
        locals: {
          thisModule: $scope.thisModule
        }
      });
    };

    $scope.showTaskDetails = function(event, index) {
      $scope.thisTask = $scope.thisStep.tasks[index];

      $mdDialog.show({
        controller: 'TaskStatusModalCtrl',
        templateUrl: '/u/213392662/OSCDashboards/serverList/taskStatusModal.html',
        parent: angular.element(document.body),
        targetEvent: event,
        locals: {
          thisTask: $scope.thisTask
        }
      });
    };

    $scope.killTask = function(event, index) {
      event.stopPropagation();
      var msg = "Are you sure you want to kill this task?";
      if( !window.confirm(msg) ){return}

      alert('Kill Task "' + $scope.thisStep.tasks[index].id + '" in Step "' + $scope.thisStep.label + '" in Execution "' + $scope.thisExecution.execId + '"');
    };

    $scope.forceTask = function(event, index) {
      event.stopPropagation();
      var msg = "Are you sure you want to force this task?";
      if( !window.confirm(msg) ){return}

      alert('Force Task "' + $scope.thisStep.tasks[index].id + '" in Step "' + $scope.thisStep.label + '" in Execution "' + $scope.thisExecution.execId + '"');
    };


    // $scope.smallServerStatusImg = function() {
    //   if($scope.server.status == 'ok'){
    //     return '/u/213392662/OSCDashboards/img/server-ok-sm.png';
    //   } else if($scope.server.status == 'warn') {
    //     return '/u/213392662/OSCDashboards/img/server-warn-sm.png';
    //   } else if($scope.server.status == 'err'){
    //     return '/u/213392662/OSCDashboards/img/server-err-sm.png';
    //   } 
    // }

  }])
  .controller('TaskStatusModalCtrl',['$scope', '$mdDialog', 'thisTask', 
    function($scope, $mdDialog, thisTask) {

      $scope.thisTask = thisTask;

      $scope.closeTaskDetails = function() {
        $mdDialog.hide();
      };

  }])
  .controller('ModuleDetailsModalCtrl',['$scope', '$mdDialog', 'thisModule', 
    function($scope, $mdDialog, thisModule) {

      $scope.thisModule = thisModule;

      $scope.closeTaskDetails = function() {
        $mdDialog.hide();
      };

  }])
  .directive('serverList', function() {
    return {
       scope: {},
       templateUrl: '/u/213392662/OSCDashboards/serverList/serverListTpl.html',
       replace: true,
       controller: 'ServerListCtrl',
       controllerAs: 'serverListCtrl'
    };
});