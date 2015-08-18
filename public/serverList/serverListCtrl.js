angular.module('ServerList', ['SharedHTTP'])
  .controller('ServerListCtrl', ['$scope', '$mdBottomSheet', 'HTTPService', '$interval', function($scope, $mdBottomSheet, HTTPService, $interval) {
    var _this = this;

    //server calls
    this.getServerList = function() {
      var url = 'servers.json';
      _this.serversArray = [];

      HTTPService.get(url, function(data){
        _this.serverList = data;
        angular.forEach(_this.serverList, function(value, key) {
          _this.getServerData(value);
        });
      });
    };
    this.getServerList();

    this.getServerData = function(thisServer) {
      if(typeof(thisServer) !== 'object') {
        var serversArray = _this.serversArray;
        angular.forEach(serversArray, function(value, key) {
          var url = 'http://' + value.message.hostname + ':3300/ping/server/irrelevent/verbose?callback=JSON_CALLBACK';
          _this.serversArray = [];
          HTTPService.jsonpServer(url, function(data){
            _this.serverData = data;
            if(_this.serverData === undefined) {
              var messageObj = {};
              var hostname = {hostname : value.message.hostname};
              messageObj.message = hostname;
              messageObj.message['status'] = 'e-offline';
              var truncHostname = value.hostname.split(".")[0];
              messageObj['hostname'] = truncHostname;
              messageObj.roles = value.roles;
              messageObj.ip = value.ip;
              _this.serversArray.push(messageObj);
            } else {
              _this.serverData.roles = value.roles;
              _this.serverData.ip = value.ip;
              var truncHostname = data.message.hostname.split(".")[0];
              _this.serverData.hostname = truncHostname;
              _this.serversArray.push(_this.serverData);
            }
          });
        });
      } else {
        var url = 'http://' + thisServer.DNSName + ':3300/ping/server/irrelevent/verbose?callback=JSON_CALLBACK';
        HTTPService.jsonpServer(url, function(data){
          _this.serverData = data;
          if(_this.serverData === undefined) {
            var messageObj = {};
            var hostname = {hostname : thisServer.DNSName};
            messageObj.message = hostname;
            messageObj.message['status'] = 'e-offline';
            var truncHostname = thisServer.DNSName.split(".")[0];
            messageObj['hostname'] = truncHostname;
            messageObj.roles = thisServer.roles;
            messageObj.ip = thisServer.ip;
            _this.serversArray.push(messageObj);
          } else {
            _this.serverData.roles = thisServer.roles;
            _this.serverData.ip = thisServer.ip;
            var truncHostname = data.message.hostname.split(".")[0];
            _this.serverData.hostname = truncHostname;
            _this.serversArray.push(_this.serverData);
          }
          if(_this.serversArray.length === 1){
            $interval(_this.getServerData, 60000, false);
          }
        });
      }
    };
    console.log(_this.serversArray);
    this.servers = _this.serversArray;

    this.getExecutions = function($event, server, index) {
      var url = 'http://' + server.message.hostname + '/status/all?callback=JSON_CALLBACK';

      HTTPService.jsonp(url, function(data){
        _this.serversArray[index].executions = data;
        _this.getExecutionPingUrls($event, index);
        _this.showBottomSheet($event, server, index);
      });
      $interval($scope.getExecutions, 600000, false);
    };

    this.getExecutionPingUrls = function($event, index) {
        var justUrls = [];
        var executionResult = _this.serversArray[index].executions.executions;

        angular.forEach(executionResult, function(value, key) {
          //iterate over the key/value pairs of each execution
          var copyValue = {};
          if(value.ping) {copyValue.ping = value.ping}
          if(value.restart) {copyValue.restart = value.restart}
          if(value.kill) {copyValue.kill = value.kill}
          if(value.pause) {copyValue.pause = value.pause}
          if(value.resume) {copyValue.resume = value.resume}
          if(value.force) {copyValue.force = value.force}
          justUrls.push(copyValue);
        });
        _this.serversArray[index].onlyExecutionUrls = justUrls;
        _this.isLoading = false;
    };

    this.checkServerData = function($event, server, index) {
      _this.isLoading = true;
      _this.getExecutions($event, server, index);
    }

    this.showBottomSheet = function($event, server, index) {
      $mdBottomSheet.show({
        templateUrl: 'serverList/templates/serverListBottomSheet.html',
        controller: 'ServerListBottomSheetCtrl',
        targetEvent: $event,
        locals: {
          thisServer: server,
          servers: _this.serversArray,
          modules: server.message.modules,
          executions: _this.serversArray[index].executions,
          executionUrls: _this.serversArray[index].onlyExecutionUrls
        }
      });
    };

    $scope.serverStatusImg = function(index) {

      if(index.message.status == 'good'){
          return { "background": "url(img/server-ok-sm.png) no-repeat", "background-size": "cover" };
      } else if(index.message.status == 'warn') {
          return { "background": "url(img/server-warn-sm.png) no-repeat", "background-size": "cover" };
      } else if(index.message.status == 'e-offline') {
          return { "background": "url('img/server-off-sm.png') no-repeat", "background-size": "cover" };
      } else {
        return { "background": "url(img/server-err-sm.png) no-repeat", "background-size": "cover" };
      }
    };

    $scope.serverOnline = function(index) {
      if(index.message.status === 'e-offline') {
        return { "pointer-events" : "none", "opacity" : "0.5"};
      }
    };
  }])

  .controller('ServerListBottomSheetCtrl',['$scope', '$mdBottomSheet', '$mdDialog', '$interval', 'HTTPService', 'servers', 'thisServer', 'modules', 'executions', 'executionUrls',
    function($scope, $mdBottomSheet, $mdDialog, $interval, HTTPService, servers, thisServer, modules, executions, executionUrls) {

    $scope.server = servers;
    $scope.thisServer = thisServer;
    $scope.modules = modules;
    $scope.executions = executions;
    $scope.executionUrls = executionUrls;

    $scope.closeBottomSheet = function() {
      $mdBottomSheet.hide();
    };

    $scope.moduleStatusImg = function(indexModule) {
        if(this.value === 'warn'){
          return { "background": "url(img/server-warn-sm.png) no-repeat", "background-size": "cover" };
        } else if(this.value === 'error'){
          return { "background": "url('img/server-err-sm.png') no-repeat", "background-size": "cover" };
        } else if (this.value === 'good'){
          return { "background": "url(img/server-ok-sm.png) no-repeat", "background-size": "cover" };
        } else {
          return { "background": "url(img/server-ok-sm.png) no-repeat", "background-size": "cover" };
        }
    };

    $scope.selectExecution = function(indexExec, results, e) {
      if(e){
        if(Array.isArray(results)) {
          //create new object of initial results
          $scope.originalResultsObj = angular.copy(results);
          var resultUrls = {};
          if(results[indexExec].ping) {resultUrls.ping = results[indexExec].ping}
          if(results[indexExec].restart) {resultUrls.restart = results[indexExec].restart}
          if(results[indexExec].kill) {resultUrls.kill = results[indexExec].kill}
          if(results[indexExec].pause) {resultUrls.pause = results[indexExec].pause}
          if(results[indexExec].resume) {resultUrls.resume = results[indexExec].resume}
          $scope.thisExecutionUrl = resultUrls;
          $scope.executionPingUrl = results[indexExec].ping + '?callback=JSON_CALLBACK';
        } else {
          var resultUrls = {};
          if($scope.originalResultsObj[indexExec].ping) {resultUrls.ping = $scope.originalResultsObj[indexExec].ping}
          if($scope.originalResultsObj[indexExec].restart) {resultUrls.restart = $scope.originalResultsObj[indexExec].restart}
          if($scope.originalResultsObj[indexExec].kill) {resultUrls.kill = $scope.originalResultsObj[indexExec].kill}
          if($scope.originalResultsObj[indexExec].pause) {resultUrls.pause = $scope.originalResultsObj[indexExec].pause}
          if($scope.originalResultsObj[indexExec].resume) {resultUrls.resume = $scope.originalResultsObj[indexExec].resume}
          $scope.thisExecutionUrl = resultUrls;
          $scope.executionPingUrl = $scope.originalResultsObj[indexExec].ping + '?callback=JSON_CALLBACK';
        }
      } else {
        // $scope.thisExecution = executions.executions[indexExec];
        $scope.thisExecutionUrl = executionUrls[indexExec];
        $scope.executionPingUrl = executionUrls[indexExec].ping + '?callback=JSON_CALLBACK';
      }
      $scope.selectedExec = indexExec;
      $scope.thisStep = undefined;
      $scope.thisTask = undefined;

      $scope.highlightSelectedExec = function(indexExec) {
        return indexExec === $scope.selectedExec ? 'highlight-select' : undefined;
      };
      $scope.getExecutions();
    };


    $scope.getExecutions = function() {
      HTTPService.jsonp($scope.executionPingUrl, function(data) {
          $scope.executionPing = data;
      });
      $interval($scope.getExecutions, 600000, false);
    };

    $scope.selectStep = function(indexStep) {
      $scope.thisStep = $scope.executionPing.message.executionDetails.steps[indexStep];
      $scope.thisTask = undefined;
      $scope.selectedStep = indexStep;

      $scope.highlightSelectedStep = function(indexStep) {
        return indexStep === $scope.selectedStep ? 'highlight-select' : undefined;
      };
      console.log($scope.thisStep);
    };

    $scope.getModuleDetails = function(event) {
      var url = 'http://' + $scope.thisServer.message.hostname + '/ping/module/' + this.key + '?callback=JSON_CALLBACK';
      var d = '';
      HTTPService.jsonp(url, function(data) {
        $scope.thisModule = data;
        if ($scope.thisModule.entityID === "workflowManager") {
          $scope.thisModule.message.total['queue'] = 'n/a';
        }
        d = new Date($scope.thisModule.date);
        $scope.thisModule.date = d.toString();
        //$scope.thisModule.date = $scope.thisModule.date.toLocaleString();
        // var convertedDateString = $scope.thisModule.date.toLocaleString();
        // convertedDateString = convertedDateString.replace('at ', '');
        // $scope.thisModule.date = new Date(convertedDateString);
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

    $scope.showTaskDetails = function(event, indexTask) {
      $scope.thisTask = $scope.thisStep.tasks[indexTask];
      $scope.selectedTask = indexTask;

      $scope.highlightSelectedTask = function(indexTask) {
        return indexTask === $scope.selectedTask ? 'highlight-select' : undefined;
      };
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

  .filter('disable', function() {
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

  .filter('keys', function() {
      return function(input) {
        if (!input) {
          return [];
        }
        return Object.keys(input);
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
          timeString = hours +"h  "+ minutes +"m  "+scnds +"s";
        }

        return timeString;
      }
  })

  .filter('dateString', function($filter) {
    return function(date) {
      if(date) {
        var dateOut = new Date(date);
        var dateOut = $filter('date')(dateOut, 'medium')
      } else {
        var dateOut = 'n/a';
      }
      return dateOut;
    }
  })

  .filter('prettyJSON', function () {
    return function (json) {
      var readable = JSON.stringify(json, null, '    ');
      return readable;
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
