angular.module('ServerList', ['SharedHTTP'])
  .controller('ServerListCtrl', ['$scope', '$mdBottomSheet', 'HTTPService', function($scope, $mdBottomSheet, HTTPService) {

    var _this = this;
    _this.serversArray = [];

    //server calls
    this.getServerList = function() {
      var url = 'servers.json';
      var server = '';
      var serverDetails = [];

      HTTPService.get(url, function(data){
        _this.serverList = data;
        angular.forEach(_this.serverList, function(value, key) {
          server = value.DNSName;
          serverDetails[0] = value.roles;
          serverDetails[1] = value.ip;
          _this.getServerData(server, serverDetails);
        });
      });
    };
    this.getServerList();

    this.getServerData = function(server, serverDetails) {
      var url = 'http://' + server + ':3300/ping/server/irrelevent/verbose?callback=JSON_CALLBACK';
      HTTPService.jsonp(url, function(data){
        _this.serverData = data;
        _this.serverData.roles = serverDetails[0];
        _this.serverData.ip = serverDetails[1];
        if(_this.serverData === false) {
          var messageObj = {'message' : {'status' : 'error'}}
          _this.serversArray.push(messageObj);
        } else {
          _this.serversArray.push(_this.serverData);
        }
      });
    };
    this.servers = _this.serversArray;

    // this.getData = function($event, index) {
    //   var thisServer = _this.serversArray[index].message.hostname;

    // };

    this.getExecutions = function($event, index) {
      var thisServer = _this.serversArray[index].message.hostname;
      var url = 'http://' + thisServer + '/status/all?callback=JSON_CALLBACK';

      HTTPService.jsonp(url, function(data){
        _this.serversArray[index].executions = data;
        _this.getExecutionPingUrls($event, index);
        _this.showBottomSheet($event, index);
      });
    };

    this.getExecutionPingUrls = function($event, index) {
        var justUrls = [];
        var executionResult = _this.serversArray[index].executions.executions;

        angular.forEach(executionResult, function(value, key) {
          //iterate over the key/value pairs of each execution
          var copyValue = angular.copy(value);
          copyValue = {};
          if(value.ping) {copyValue.ping = value.ping}
          if(value.restart) {copyValue.restart = value.restart}
          if(value.kill) {copyValue.kill = value.kill}
          if(value.pause) {copyValue.pause = value.pause}
          if(value.resume) {copyValue.resume = value.resume}
          if(value.force) {copyValue.force = value.force}
          justUrls.push(copyValue);
        });
        _this.serversArray[index].onlyExecutionUrls = justUrls;
    };

    this.checkServerData = function($event, index) {
      // if (typeof(_this.serversArray[index].modulesArray) === 'undefined') {
        this.getExecutions($event, index);
        // this.getExecutions($event, index);
      // } else {
        //var modules = _this.serversArray[index].message.modules;
      // }
    }

    this.showBottomSheet = function($event, index) {
      $mdBottomSheet.show({
        templateUrl: 'serverList/templates/serverListBottomSheet.html',
        controller: 'ServerListBottomSheetCtrl',
        targetEvent: $event,
        locals: {
          thisServer: _this.serversArray[index],
          servers: _this.serversArray,
          modules: _this.serversArray[index].message.modules,
          executions: _this.serversArray[index].executions,
          executionUrls: _this.serversArray[index].onlyExecutionUrls
        }
      });
    };

    $scope.serverStatusImg = function(index) {
      var thisServer = _this.serversArray[index];
      if(thisServer.message.status !== 'error') {
        if(thisServer.message.status == 'good'){
          return { "background": "url(img/server-ok-sm.png) no-repeat", "background-size": "cover" };
        } else if(thisServer.message.status == 'warn') {
          return { "background": "url(img/server-warn-sm.png) no-repeat", "background-size": "cover" };
        } else if(thisServer.message.status == 'error'){
          return { "background": "url('img/server-err-sm.png') no-repeat", "background-size": "cover" };
        } else {
          return { "background": "url(img/server-ok-sm.png) no-repeat", "background-size": "cover" };
        }
      } else {
        return { "background": "url('img/server-err-sm.png') no-repeat", "background-size": "cover" };
      }
    };



  }])

  .controller('ServerListBottomSheetCtrl',['$scope', '$mdBottomSheet', '$mdDialog', 'HTTPService', 'servers', 'thisServer', 'modules', 'executions', 'executionUrls',
    function($scope, $mdBottomSheet, $mdDialog, HTTPService, servers, thisServer, modules, executions, executionUrls) {

    $scope.server = servers;
    $scope.thisServer = thisServer;
    $scope.modules = modules;
    $scope.executions = executions;
    $scope.executionUrls = executionUrls;

    $scope.closeBottomSheet = function() {
      $mdBottomSheet.hide();
    };

    $scope.moduleStatusImg = function(index) {
        if(this.value === 'warn'){
          return { "background": "url(img/server-warn-sm.png) no-repeat", "background-size": "cover" };
        } else if(this.value === 'error'){
          return { "background": "url('img/server-err-sm.png') no-repeat", "background-size": "cover" };
        } else if (this.value === 'running'){
          return { "background": "url(img/server-ok-sm.png) no-repeat", "background-size": "cover" };
        } else {
          return { "background": "url(img/server-ok-sm.png) no-repeat", "background-size": "cover" };
        }
    };

    $scope.selectExecution = function(index) {
      $scope.thisExecution = executions.executions[index];
      $scope.thisExecutionUrl = executionUrls[index];
      $scope.thisStep = undefined;
      $scope.thisTask = undefined;
      $scope.executionPingUrl = executionUrls[index].ping + '?callback=JSON_CALLBACK';

      HTTPService.jsonp($scope.executionPingUrl, function(data) {
        console.log(data);
        $scope.executionPing = data;
      });
    };

    $scope.selectStep = function(index) {
      $scope.thisStep = $scope.executionPing.message.executionDetails.steps[index];
      $scope.thisTask = undefined;
      console.log($scope.thisStep);
    };

    $scope.getModuleDetails = function(event) {
      var url = 'http://' + $scope.thisServer.message.hostname + '/ping/module/' + this.key + '?callback=JSON_CALLBACK';
      HTTPService.jsonp(url, function(data) {
        $scope.thisModule = data;
        if ($scope.thisModule.entityID === "workflowManager") {
          $scope.thisModule.message.total['queue'] = 'n/a';
        }
        $scope.showModuleDetails(event);
      });
    }

    $scope.showModuleDetails = function(event) {
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
