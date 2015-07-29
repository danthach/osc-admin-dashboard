angular.module('ServerList', ['SharedHTTP'])
  .controller('ServerListCtrl', ['$scope', '$mdBottomSheet', 'HTTPService', function($scope, $mdBottomSheet, HTTPService) {

    var _this = this;
    _this.serversArray = [];
    _this.modulesArray = [];

    this.getServerData = function() {
      var url = 'servers.json';
      HTTPService.get(url, function(data){
        _this.allServers = data;
      });
    };
    this.getServerData();

    //server calls
    this.getServer1 = function() {
      var url = 'http://localhost:3300/ping/server/irrelevent/verbose';
      HTTPService.get(url, function(data){
        _this.server1 = data;
        _this.serversArray.push(_this.server1);
      });
    };
    this.getServer1();

    this.getServer2 = function() {
      var url = 'http://localhost:3300/ping/server/irrelevent/verbose';
      HTTPService.get(url, function(data){
        _this.server2 = data;
        _this.serversArray.push(_this.server2);
      });
    };
    this.getServer2();

    this.getServer3 = function() {
      var url = 'http://localhost:3300/ping/server/irrelevent/verbose';
      HTTPService.get(url, function(data){
        _this.server3 = data;
        _this.serversArray.push(_this.server3);
      });
    };
    this.getServer3();

    this.getServer4 = function() {
      var url = 'http://localhost:3300/ping/server/irrelevent/verbose';
      HTTPService.get(url, function(data){
        _this.server4 = data;
        _this.serversArray.push(_this.server4);
      });
    };
    this.getServer4();

    this.getServer5 = function() {
      var url = 'http://localhost:3300/ping/server/irrelevent/verbose';
      HTTPService.get(url, function(data){
        _this.server5 = data;
        _this.serversArray.push(_this.server5);
      });
    };
    this.getServer5();

    this.getServer6 = function() {
      var url = 'http://localhost:3300/ping/server/irrelevent/verbose';
      HTTPService.get(url, function(data){
        _this.server6 = data;
        _this.serversArray.push(_this.server6);
      });
    };
    this.getServer6();

    // module calls
    this.getOscLogger = function() {
      var url = 'http://localhost:3300/ping/module/oscLogger/verbose';
      HTTPService.get(url, function(data){
        _this.oscLogger = data;
        _this.modulesArray.push(_this.oscLogger);
      });
    };
    this.getOscLogger();

    this.getWorkflowManager = function() {
      var url = 'http://localhost:3300/ping/module/workflowManager/verbose';
      HTTPService.get(url, function(data){
        _this.workflowManager = data;
        _this.modulesArray.push(_this.workflowManager);
      });
    };
    this.getWorkflowManager();

    this.getHttpApi = function() {
      var url = 'http://localhost:3300/ping/module/httpAPI/verbose';
      HTTPService.get(url, function(data){
        _this.httpApi = data;
        _this.modulesArray.push(_this.httpApi);
      });
    };
    this.getHttpApi();

    this.getEncoder= function() {
      var url = 'http://localhost:3300/ping/module/encoder/verbose';
      HTTPService.get(url, function(data){
        _this.encoder = data;
        _this.modulesArray.push(_this.encoder);
      });
    };
    this.getEncoder();

    this.getImageProcessor = function() {
      var url = 'http://localhost:3300/ping/module/imageProcessor/verbose';
      HTTPService.get(url, function(data){
        _this.imageProcessor = data;
        _this.modulesArray.push(_this.imageProcessor);
      });
    };
    this.getImageProcessor();

    this.getHttpNotifier = function() {
      var url = 'http://localhost:3300/ping/module/httpNotifier/verbose';
      HTTPService.get(url, function(data){
        _this.httpNotifier = data;
        _this.modulesArray.push(_this.httpNotifier);
      });
    };
    this.getHttpNotifier();

    this.getFileManager = function() {
      var url = 'http://localhost:3300/ping/module/fileManager/verbose';
      HTTPService.get(url, function(data){
        _this.fileManager = data;
        _this.modulesArray.push(_this.fileManager);
      });
    };
    this.getFileManager();

    //executions
    this.getExecutions = function() {
      var url = 'http://localhost:3300/status/complete';
      HTTPService.get(url, function(data){
        _this.executions = data;
        var executionResult = _this.executions.executions;
        var justUrls = [];
        var copyValue = {};

        angular.forEach(executionResult, function(value, key) {
          //iterate over the key/value pairs of each execution
          copyValue = angular.copy(value);
          angular.forEach(copyValue, function(v, k) {
            // find the urls for execution
            if (k === 'ping') {
              return;
            } else if (k === 'restart') {
              return;
            } else if (k === 'kill') {
              return;
            } else if (k === 'pause') {
              return;
            } else if (k === 'resume') {
              return;
            } else if (k === 'force') {
              return;
            } else {
              delete copyValue[k]
            }
          });
          justUrls.push(copyValue);
        });
        _this.onlyExecutionUrls = justUrls;
      });
    };
    this.getExecutions();

    this.showBottomSheet = function($event, index) {
      // var serversArray = _this.server1 + _this.server2 + _this.server3 + _this.server4 + _this.server5 + _this.server6;
      // var modulesArray = _this.oscLogger + _this.workflowManager + _this.httpApi + _this.encoder + _this.imageProcessor + _this.httpNotifier + _this.fileManager;

      $mdBottomSheet.show({
        templateUrl: 'serverList/templates/serverListBottomSheet.html',
        controller: 'ServerListBottomSheetCtrl',
        targetEvent: $event,
        locals: {
          // thisServer: _this.allServers[index],
          thisServer: _this.serversArray[index],
          servers: _this.serversArray,
          modules: _this.modulesArray,
          thisExecution: _this.executions[index],
          executions: _this.executions,
          executionUrls: _this.onlyExecutionUrls,
          thisExecutionUrl: _this.onlyExecutionUrls[index],
          thisExecutionPing: $scope.executionPing
        }
      });
    };

    // this.serverStatusImg = function(index) {
    //   var serversObj = _this.server1 + _this.server2 + _this.server3 + _this.server4 + _this.server5 + _this.server6;
    //   var thisServer = serversObj[index];
    //   console.log('thisServer: ' + thisServer);

    //   if(thisServer.message.status == 'good'){
    //     return { "background": "url(img/server-ok-sm.png) no-repeat", "background-size": "cover" };
    //   } else if(thisServer.message.status == 'warn') {
    //     return { "background": "url(img/server-warn-sm.png) no-repeat", "background-size": "cover" };
    //   } else if(thisServer.message.status == 'error'){
    //     return { "background": "url('img/server-err-sm.png') no-repeat", "background-size": "cover" };
    //   } else {
    //     return { "background": "url(img/server-ok-sm.png) no-repeat", "background-size": "cover" };
    //   }
    // };

    this.servers = _this.serversArray;
    //   {
    //     name: "Server One",
    //     host: "uatfms.amsoscar.com",
    //     roles: ["Full Stack", "Clips"],
    //     ip: "76.120.70.39",
    //     uptime: "36d 8h 29m",
    //     diskUsage: "38%",
    //     status: 3,
    //     executions: [
    //           {execId: 1433276102578, status: 'OK', steps: [
    //             {label: 'Create Media Directories', status: 'OK', tasks: [
    //               {id: 'fileManager', status: 'OK', error: 'This is the task error output - its very informative, right?'}
    //             ]},
    //             {label: 'Live Encode', status: 'OK', tasks: [
    //               {id: 'encoder', status: 'OK', error: 'This is the task error output - its very informative, right?'},
    //               {id: 'nttpNotifier', status: 'OK', error: 'This is the task error output - its very informative, right?'}
    //             ]},
    //             {label: 'Upload Stream and Create Spritesheet', status: 'OK', tasks: [
    //               {id: 'fileManager', status: 'OK', error: 'This is the task error output - its very informative, right?'},
    //               {id: 'imgProcessor', status: 'OK', error: 'This is the task error output - its very informative, right?'},
    //               {id: 'httpNotifier', status: 'OK', error: 'This is the task error output - its very informative, right?'}
    //             ]},
    //             {label: 'Upload VTT', status: 'OK', tasks: [
    //               {id: 'encoder', status: 'OK', error: 'This is the task error output - its very informative, right?'},
    //               {id: 'nttpNotifier', status: 'OK', error: 'This is the task error output - its very informative, right?'}
    //             ]},
    //             {label: 'Upload Thumbnails', status: 'OK', tasks: [
    //               {id: 'fileManager', status: 'OK', error: 'This is the task error output - its very informative, right?'},
    //               {id: 'imgProcessor', status: 'OK', error: 'This is the task error output - its very informative, right?'},
    //               {id: 'httpNotifier', status: 'OK', error: 'This is the task error output - its very informative, right?'}
    //             ]},
    //             {label: 'Upload Thumbnails', status: 'OK', tasks: [
    //               {id: 'encoder', status: 'OK', error: 'This is the task error output - its very informative, right?'},
    //               {id: 'nttpNotifier', status: 'OK', error: 'This is the task error output - its very informative, right?'}
    //             ]}
    //           ]},
    //           {execId: 1433276141541, status: 'OK'},
    //           {execId: 1433276104647, status: 'OK'},
    //           {execId: 1433276102578, status: 'OK'},
    //         ]
    //   },
    //   {
    //     name: "Server Two",
    //     host: "uatfms.amsoscar.com",
    //     roles: ["Live", "Encode"],
    //     ip: "76.120.70.39",
    //     uptime: "36d 8h 29m",
    //     diskUsage: "38%",
    //     status: 1,
    //     executions: [
    //           {execId: 1433276102578, status: 'OK'},
    //           {execId: 1433276141541, status: 'OK'},
    //           {execId: 1433276104647, status: 'OK'},
    //           {execId: 1433276102578, status: 'OK'},
    //         ]
    //   },
    //   {
    //     name: "Server Three",
    //     host: "uatfms.amsoscar.com",
    //     roles: ["Full Stack", "Clips"],
    //     ip: "76.120.70.39",
    //     uptime: "36d 8h 29m",
    //     diskUsage: "38%",
    //     status: 3,
    //     executions: [
    //           {execId: 1433276102578, status: 'OK'},
    //           {execId: 1433276141541, status: 'OK'},
    //           {execId: 1433276104647, status: 'OK'},
    //           {execId: 1433276102578, status: 'OK'},
    //         ]
    //   },
    //   {
    //     name: "Server Four",
    //     host: "uatfms.amsoscar.com",
    //     roles: ["Clips"],
    //     ip: "76.120.70.39",
    //     uptime: "36d 8h 29m",
    //     diskUsage: "38%",
    //     status: 3,
    //     executions: [
    //           {execId: 1433276102578, status: 'OK'},
    //           {execId: 1433276141541, status: 'OK'},
    //           {execId: 1433276104647, status: 'OK'},
    //           {execId: 1433276102578, status: 'OK'},
    //         ]
    //   },
    //   {
    //     name: "Server Five",
    //     host: "uatfms.amsoscar.com",
    //     roles: ["Full Stack", "Clips", "Live Encode"],
    //     ip: "76.120.70.39",
    //     uptime: "36d 8h 29m",
    //     diskUsage: "38%",
    //     status: 1,
    //     executions: [
    //           {execId: 1433276102578, status: 'OK'},
    //           {execId: 1433276141541, status: 'OK'},
    //           {execId: 1433276104647, status: 'OK'},
    //           {execId: 1433276102578, status: 'OK'},
    //         ]
    //   },
    //   {
    //     name: "Server Six",
    //     host: "uatfms.amsoscar.com",
    //     roles: ["Full Stack", "Clips"],
    //     ip: "76.120.70.39",
    //     uptime: "36d 8h 29m",
    //     diskUsage: "38%",
    //     status: 2,
    //     executions: [
    //           {execId: 1433276102578, status: 'OK'},
    //           {execId: 1433276141541, status: 'OK'},
    //           {execId: 1433276104647, status: 'OK'},
    //           {execId: 1433276102578, status: 'OK'},
    //         ]
    //   },
    //   {
    //     name: "Server Seven",
    //     host: "uatfms.amsoscar.com",
    //     roles: ["Full Stack"],
    //     ip: "76.120.70.39",
    //     uptime: "36d 8h 29m",
    //     diskUsage: "38%",
    //     status: 1,
    //     executions: [
    //           {execId: 1433276102578, status: 'OK'},
    //           {execId: 1433276141541, status: 'OK'},
    //           {execId: 1433276104647, status: 'OK'},
    //           {execId: 1433276102578, status: 'OK'},
    //         ]
    //   }
    // ];

  //   this.modules = [
  //         {
  //           moduleName: "module name 1",
  //           status: "ok",
  //           completedTasks: 78,
  //           inProgressTasks: 2,
  //           inQueueTasks: 23,
  //           erroredTasks: 0
  //         },
  //         {
  //           moduleName: "module name 2",
  //           status: "ok",
  //         },
  //         {
  //           moduleName: "module name 3",
  //           status: "warn",
  //         },
  //         {
  //           moduleName: "module name 4",
  //           status: "err",
  //         },
  //         {
  //           moduleName: "module name 5",
  //           status: "ok",
  //         },
  //         {
  //           moduleName: "module name 6",
  //           status: "ok",
  //         },
  //         {
  //           moduleName: "module name 7",
  //           status: "ok",
  //         }
  //       ];

  }])

  .controller('ServerListBottomSheetCtrl',['$scope', '$mdBottomSheet', '$mdDialog', 'servers', 'thisServer', 'modules', 'executions', 'thisExecution', 'executionUrls', '$http',
    function($scope, $mdBottomSheet, $mdDialog, servers, thisServer, modules, executions, thisExecution, executionUrls, $http) {

    $scope.server = servers;
    $scope.thisServer = thisServer;
    $scope.modules= modules;
    $scope.executions = executions;

    $scope.closeBottomSheet = function() {
      $mdBottomSheet.hide();
    };

    // $scope.filterUrls = function(items) {
    //     var result = [];
    //     var executionUrls = [];

    //     angular.forEach(items, function(value, key) {
    //       angular.forEach(value, function(v, k) {
    //         if (k === 'ping') {
    //           result.push({'ping':v});
    //         } else if (k === 'pause') {
    //           result.push({'pause':v});
    //         } else if (k === 'resume') {
    //           result.push({'resume':v});
    //         } else if (k === 'force') {
    //           result.push({'force':v});
    //         } else if (k === 'kill') {
    //           result.push({'kill':v});
    //         } else if (k === 'restart') {
    //           result.push({'restart':v});
    //         }
    //       });
    //       executionUrls.push(result);
    //     });
    //     return result;
    // };

    $scope.moduleStatusImg = function(index) {
      if($scope.modules[index].message){
        if($scope.modules[index].message.status == 'warn'){
          return { "background": "url(img/server-warn-sm.png) no-repeat", "background-size": "cover" };
        } else if($scope.modules[index].message.status == 'err'){
          return { "background": "url('img/server-err-sm.png') no-repeat", "background-size": "cover" };
        } else {
          return { "background": "url(img/server-ok-sm.png) no-repeat", "background-size": "cover" };
        }
      } else {
        return { "background": "url('img/server-err-sm.png') no-repeat", "background-size": "cover" };
      }
    };

    // $scope.selectModule = function(index) {
    //   $scope.thisModule = $scope.server.modules[index];
    //   $scope.thisExecution = undefined;
    //   $scope.thisStep = undefined;
    //   $scope.thisTask = undefined;
    // };

    $scope.selectExecution = function(index) {
      $scope.thisExecution = executions.executions[index];
      $scope.thisExecutionUrl = executionUrls[index];
      $scope.thisStep = undefined;
      $scope.thisTask = undefined;
      $scope.executionPingUrl = executionUrls[index].ping;

      //var url = $scope.executionPingUrl;
      $http.get($scope.executionPingUrl).
        success(function(data) {
          console.log(data);
          $scope.executionPing = data;
      });
    };

    $scope.selectStep = function(index) {
      $scope.thisStep = $scope.executionPing.message.executionDetails.steps[index];
      $scope.thisTask = undefined;
      console.log($scope.thisStep);
    };

    $scope.showModuleDetails = function(event, index) {
      $scope.thisModule = $scope.modules[index];

      $mdDialog.show({
        controller: 'ModuleDetailsModalCtrl',
        templateUrl: 'serverList/templates/moduleDetailsModal.html',
        parent: angular.element(document.body),
        targetEvent: event,
        locals: {
          thisModule: $scope.thisModule
        }
      });
    };

    $scope.showTaskDetails = function(event, index) {
      $scope.thisTask = $scope.thisStep.tasks[index];
      console.log($scope.thisTask);

      $mdDialog.show({
        controller: 'TaskStatusModalCtrl',
        templateUrl: 'serverList/templates/taskStatusModal.html',
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
    //     return 'img/server-ok-sm.png';
    //   } else if($scope.server.status == 'warn') {
    //     return 'img/server-warn-sm.png';
    //   } else if($scope.server.status == 'err'){
    //     return 'img/server-err-sm.png';
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

  .filter('without', function() {
    return function(items, field) {
      var result = {};
      angular.forEach(items, function(value, key) {
        if (key !== field) {
          result[key] = value;
        }
      });
      return result;
    };
  })

  // .filter('withoutMult', function() {
  //   return function(execs, field) {
  //     field = field.split(',');
  //     var result = {};
  //     angular.forEach(execs, function(value, key) {
  //       for (var i = 0; i < field.length; i++) {
  //         if (key !== field) {
  //           result[key] = value;
  //         }
  //       };
  //     });
  //     return result;
  //   };
  // })

  .directive('serverList', function() {
    return {
       scope: {},
       templateUrl: 'serverList/templates/serverListTpl.html',
       replace: true,
       controller: 'ServerListCtrl',
       controllerAs: 'serverListCtrl'
    };
});
