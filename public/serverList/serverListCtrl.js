angular.module('ServerList', ['SharedHTTP'])
  .controller('ServerListCtrl', ['$scope', '$mdBottomSheet', 'HTTPService', function($scope, $mdBottomSheet, HTTPService) {

    var _this = this;
    _this.serversArray = [];
    // _this.serversArray[index] = 0;
    // _this.serversArray[index].modulesArray = [];

    // this.getServerData = function() {
    //   var url = 'servers.json';
    //   HTTPService.get(url, function(data){
    //     _this.allServers = data;
    //   });
    // };
    // this.getServerData();

    // this.secondsToHMS = function(d) {
    //   d = Number(d);
    //   var h = Math.floor(d / 3600);
    //   var m = Math.floor(d % 3600 / 60);
    //   var s = Math.floor(d % 3600 % 60);
    //   return ((h > 0 ? (h >= 10 ? h : '0' + h): '00') + ':' + (m > 0 ? (m >= 10 ? m : '0' + m): '00') + ':' + (s > 0 ? (s >= 10 ? s : '0' + s): '00')  );
    // };

    //server calls
    this.getServer1 = function() {
      var url = 'http://54.197.231.168:3300/ping/server/irrelevent/verbose';
      HTTPService.get(url, function(data){
        _this.server1 = data;
        _this.server1['ip'] = '54.197.231.168:3300';
        _this.serversArray.push(_this.server1);
      });
    };
    this.getServer1();

    this.getServer2 = function() {
      var url = 'http://redevfms1.amsoscar.com:3300/ping/server/irrelevent/verbose';
      HTTPService.get(url, function(data){
        _this.server2 = data;
        _this.server2['ip'] = '123.111.222.333:3300';
        _this.serversArray.push(_this.server2);
      });
    };
    this.getServer2();

    // this.getServer3 = function() {
    //   var url = 'http://devfms508.amsoscar.com:3300/ping/server/irrelevent/verbose';
    //   HTTPService.get(url, function(data){
    //     _this.server3 = data;
    //     _this.serversArray.push(_this.server3);
    //   });
    // };
    // this.getServer3();

    // this.getServer4 = function() {
    //   var url = 'http://qafms.amsoscar.com:3300/ping/server/irrelevent/verbose';
    //   HTTPService.get(url, function(data){
    //     _this.server4 = data;
    //     _this.serversArray.push(_this.server4);
    //   });
    // };
    // this.getServer4();

    // this.getServer5 = function() {
    //   var url = 'http://uatfms2.amsoscar.com:3300/ping/server/irrelevent/verbose';
    //   HTTPService.get(url, function(data){
    //     _this.server5 = data;
    //     _this.serversArray.push(_this.server5);
    //   });
    // };
    // this.getServer5();

    // this.getServer6 = function() {
    //   var url = 'http://uatfms3.amsoscar.com:3300/ping/server/irrelevent/verbose';
    //   HTTPService.get(url, function(data){
    //     _this.server6 = data;
    //     _this.serversArray.push(_this.server6);
    //   });
    // };
    // this.getServer6();

    // module calls
    this.getOscLogger = function(theServer, index) {
      var url = 'http://' + theServer + '/ping/module/oscLogger/verbose';
      _this.serversArray[index].modulesArray = [];
      HTTPService.get(url, function(data){
        _this.oscLogger = data;
        _this.serversArray[index].modulesArray.push(_this.oscLogger);
      });
    };

    this.getWorkflowManager = function(theServer, index) {
      var url = 'http://' + theServer + '/ping/module/workflowManager/verbose';
      _this.serversArray[index].modulesArray = [];
      HTTPService.get(url, function(data){
        _this.workflowManager = data;
        _this.serversArray[index].modulesArray.push(_this.workflowManager);
      });
    };

    this.getHttpApi = function(theServer, index) {
      var url = 'http://' + theServer + '/ping/module/httpAPI/verbose';
      _this.serversArray[index].modulesArray = [];
      HTTPService.get(url, function(data){
        _this.httpApi = data;
        _this.serversArray[index].modulesArray.push(_this.httpApi);
      });
    };

    this.getEncoder= function(theServer, index) {
      var url = 'http://' + theServer + '/ping/module/encoder/verbose';
      _this.serversArray[index].modulesArray = [];
      HTTPService.get(url, function(data){
        _this.encoder = data;
        _this.serversArray[index].modulesArray.push(_this.encoder);
      });
    };

    this.getImageProcessor = function(theServer, index) {
      var url = 'http://' + theServer + '/ping/module/imageProcessor/verbose';
      _this.serversArray[index].modulesArray = [];
      HTTPService.get(url, function(data){
        _this.imageProcessor = data;
        _this.serversArray[index].modulesArray.push(_this.imageProcessor);
      });
    };

    this.getHttpNotifier = function(theServer, index) {
      var url = 'http://' + theServer + '/ping/module/httpNotifier/verbose';
      _this.serversArray[index].modulesArray = [];
      HTTPService.get(url, function(data){
        _this.httpNotifier = data;
        _this.serversArray[index].modulesArray.push(_this.httpNotifier);
      });
    };

    this.getFileManager = function(theServer, index) {
      var url = 'http://' + theServer + '/ping/module/fileManager/verbose';
      _this.serversArray[index].modulesArray = [];
      HTTPService.get(url, function(data){
        _this.fileManager = data;
        _this.serversArray[index].modulesArray.push(_this.fileManager);
      });
    };

    this.getData = function($event, index) {
      var thisServer = _this.serversArray[index].message.hostname;
      console.log(thisServer);

      this.getOscLogger(thisServer, index);
      this.getWorkflowManager(thisServer, index);
      this.getHttpApi(thisServer, index);
      this.getEncoder(thisServer, index);
      this.getImageProcessor(thisServer, index);
      this.getHttpNotifier(thisServer, index);
      this.getFileManager(thisServer, index);
    };

    this.getExecutions = function($event, index) {
      var thisServer = _this.serversArray[index].message.hostname;
      var url = 'http://' + thisServer + '/status/all';

      HTTPService.get(url, function(data){
        _this.serversArray[index].executions = data;
        _this.getExecutionPingUrls($event, index);
      });
    };

    this.getExecutionPingUrls = function($event, index) {
        var justUrls = [];
        var copyValue = {};
        var executionResult = _this.serversArray[index].executions.executions;

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
        _this.serversArray[index].onlyExecutionUrls = justUrls;
        this.checkServerData($event, index);
    };

    this.checkServerData = function($event, index) {
      if (typeof(_this.serversArray[index].modulesArray) === 'undefined') {
        this.getData($event, index);
        this.getExecutions($event, index);
      } else {
        this.showBottomSheet($event, index);
      }
    }

    this.showBottomSheet = function($event, index) {
      $mdBottomSheet.show({
        templateUrl: 'serverList/templates/serverListBottomSheet.html',
        controller: 'ServerListBottomSheetCtrl',
        targetEvent: $event,
        locals: {
          // thisServer: _this.allServers[index],
          thisServer: _this.serversArray[index],
          servers: _this.serversArray,
          modules: _this.serversArray[index].modulesArray,
          executions: _this.serversArray[index].executions,
          // thisExecution: _this.executions[index],
          executionUrls: _this.serversArray[index].onlyExecutionUrls
          // thisExecutionUrl: _this.onlyExecutionUrls[index]
          // thisExecutionPing: _this.executionPing
        }
      });
    };

    this.serverStatusImg = function(index) {
      var thisServer = _this.serversArray[index];

      if(thisServer.message.status == 'good'){
        return { "background": "url(img/server-ok-sm.png) no-repeat", "background-size": "cover" };
      } else if(thisServer.message.status == 'warn') {
        return { "background": "url(img/server-warn-sm.png) no-repeat", "background-size": "cover" };
      } else if(thisServer.message.status == 'error'){
        return { "background": "url('img/server-err-sm.png') no-repeat", "background-size": "cover" };
      } else {
        return { "background": "url(img/server-ok-sm.png) no-repeat", "background-size": "cover" };
      }
    };

    this.servers = _this.serversArray;

  }])

  .controller('ServerListBottomSheetCtrl',['$scope', '$mdBottomSheet', '$mdDialog', '$http', 'servers', 'thisServer', 'modules', 'executions', 'executionUrls',
    function($scope, $mdBottomSheet, $mdDialog, $http, servers, thisServer, modules, executions, executionUrls) {

    $scope.server = servers;
    $scope.thisServer = thisServer;
    $scope.modules = modules;
    $scope.executions = executions;
    $scope.executionUrls = executionUrls;

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
      if ($scope.thisModule.entityID === "workflowManager") {
        $scope.thisModule.message.total['queue'] = 'n/a';
      }

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
      angular.forEach($scope.thisTask, function(value, key) {
        if (typeof value === "undefined") {
          $scope.thisTask[key] = "undefined";
        } else if (value === null) {
          $scope.thisTask[key] = "null";
        }
      });

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

    $scope.showSettings = function(event, index) {
      $mdDialog.show({
        controller: 'SettingsModalCtrl',
        templateUrl: 'serverList/templates/settingsModal.html',
        parent: angular.element(document.body),
        targetEvent: event,
        locals: {
          executionPing: $scope.executionPing
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

  .controller('SettingsModalCtrl',['$scope', '$mdDialog', 'executionPing',
    function($scope, $mdDialog, executionPing) {
      $scope.executionPing = executionPing;
      $scope.closeTaskDetails = function() {
        $mdDialog.hide();
      };
  }])

  .filter('with', function() {
    return function(items, field) {
      var result = {};
      angular.forEach(items, function(value, key) {
        if (key === field) {
          result[key] = value;
        }
      });
      return result;
    };
  })

  .filter('without', function() {
    return function(items, field) {
      var result = {};
      if(items !== undefined) {
        angular.forEach(items, function(value, key) {
          if (key !== field) {
            result[key] = value;
          }
        });
      } else {
        result = {};
      }
      return result;
    };
  })

  .filter('only', function() {
    return function(items, field) {
      if(items !== undefined) {
        if(Object.keys(items).length === 1) {
          return items;
        }
      } else {
        return {status:'Module not found.'};
      }
    }
  })

  .filter('secondsToTimeString', function() {
      //Returns duration from milliseconds in hh:mm:ss format.
      return function(seconds) {
        var h = 3600;
        var m = 60;
        var hours = Math.floor(seconds/h);
        var minutes = Math.floor( (seconds % h)/m );
        var scnds = Math.floor( (seconds % m) );
        var timeString = '';
        if(scnds < 10) scnds = "0"+scnds;
        if(hours < 10) hours = "0"+hours;
        if(minutes < 10) minutes = "0"+minutes;
        if (hours == "00") {
          timeString = minutes +" minutes "+scnds +" seconds";
        } else {
          timeString = hours +" hours "+ minutes +" minutes "+scnds +" seconds";
        }

        return timeString;
    }
  })

  .directive('serverList', function() {
    return {
       scope: {},
       templateUrl: 'serverList/templates/serverListTpl.html',
       replace: true,
       controller: 'ServerListCtrl',
       controllerAs: 'serverListCtrl'
    };
});
