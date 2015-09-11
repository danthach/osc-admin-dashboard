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
          var url = 'http://' + value.message.hostname + '/ping/server/irrelevent/verbose?callback=JSON_CALLBACK';
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
            $interval(_this.getServerData, 150000, false);
          }
        });
      }
    };
    this.servers = _this.serversArray;

    this.getExecutions = function($event, server, index) {
      _this.serverUrl = 'http://' + server.message.hostname + '/status/all?callback=JSON_CALLBACK';
      HTTPService.jsonpExec(_this.serverUrl, function(data){
        if(data){
          _this.serversArray[index].executions = data;
          _this.getExecutionPingUrls($event, index);
          _this.showBottomSheet($event, server, index);
        } else {
          _this.isLoading = false;
        }
      });
      //$interval($scope.getExecutions, 3000, false);
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
    };

    this.checkServerData = function($event, server, index) {
      _this.isLoading = true;
      _this.getExecutions($event, server, index);
    }

    this.showBottomSheet = function($event, server, index) {
      _this.isLoading = false;
      $mdBottomSheet.show({
        templateUrl: 'serverList/templates/serverListBottomSheet.html',
        controller: 'ServerListBottomSheetCtrl',
        targetEvent: $event,
        locals: {
          thisServer: server,
          serverUrl: _this.serverUrl,
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

  .controller('ServerListBottomSheetCtrl',['$scope', '$mdBottomSheet', '$mdDialog', '$interval', 'HTTPService', 'servers', 'serverUrl', 'thisServer', 'modules', 'executions', 'executionUrls',
    function($scope, $mdBottomSheet, $mdDialog, $interval, HTTPService, servers, serverUrl, thisServer, modules, executions, executionUrls) {

    $scope.server = servers;
    $scope.serverUrl = serverUrl;
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
          $scope.originalExecResultsObj = angular.copy(results);
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
          if($scope.originalExecResultsObj[indexExec].ping) {resultUrls.ping = $scope.originalExecResultsObj[indexExec].ping}
          if($scope.originalExecResultsObj[indexExec].restart) {resultUrls.restart = $scope.originalExecResultsObj[indexExec].restart}
          if($scope.originalExecResultsObj[indexExec].kill) {resultUrls.kill = $scope.originalExecResultsObj[indexExec].kill}
          if($scope.originalExecResultsObj[indexExec].pause) {resultUrls.pause = $scope.originalExecResultsObj[indexExec].pause}
          if($scope.originalExecResultsObj[indexExec].resume) {resultUrls.resume = $scope.originalExecResultsObj[indexExec].resume}
          $scope.thisExecutionUrl = resultUrls;
          $scope.executionPingUrl = $scope.originalExecResultsObj[indexExec].ping + '?callback=JSON_CALLBACK';
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
      $scope.getThisExecution();
      $interval($scope.getThisExecution, 30000, false);
      $interval($scope.getExecutions, 30000, false);
    };

    $scope.getThisExecution = function() {
      HTTPService.jsonp($scope.executionPingUrl, function(data) {
          $scope.executionPing = data;
      });
    };

    $scope.getExecutions = function() {
      HTTPService.jsonp($scope.serverUrl, function(data) {
          $scope.executions = data;
      });
    };

    $scope.selectOperation = function(operationUrl, results) {
        $scope.thisOperationUrl = operationUrl + '?callback=JSON_CALLBACK';
        $scope.performOperation();
    };

    $scope.performOperation = function() {
      HTTPService.jsonp($scope.thisOperationUrl, function(data) {
          //$scope.operationResponse = data;
          $scope.operationResponse = data;
          $scope.showOperationResponse(event);
      });
      $scope.getExecutions();
    };

    $scope.showOperationResponse = function(event) {
      $mdDialog.show({
        controller: 'OperationResponseModalCtrl',
        templateUrl: 'serverList/templates/operationResModalCtrl.html',
        parent: angular.element(document.body),
        targetEvent: event,
        locals: {
          operationResponse: $scope.operationResponse
        }
      });
    };

    $scope.selectStep = function(indexStep, results, s) {
      $scope.thisStep = results[indexStep];
      $scope.thisTask = undefined;
      $scope.selectedStep = indexStep;
      console.log($scope.thisStep);
      $scope.highlightSelectedStep = function(indexStep) {
        return indexStep === $scope.selectedStep ? 'highlight-select' : undefined;
      };
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

    $scope.showTaskDetails = function(event, indexTask, results, t) {
      $scope.thisTask = results[indexTask];
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

    $scope.showExecutionFiles = function(event, index) {
      $mdDialog.show({
        controller: 'ExecutionFilesCtrl',
        templateUrl: 'serverList/templates/executionFilesModal.html',
        parent: angular.element(document.body),
        targetEvent: event,
        locals: {
          settingsObject: $scope.executionPing.message.executionDetails.settingsObj
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
  .controller('OperationResponseModalCtrl',['$scope', '$mdDialog', 'operationResponse',
    function($scope, $mdDialog, operationResponse) {
      $scope.operationResponse = operationResponse;
      $scope.closeTaskDetails = function() {
        $mdDialog.hide();
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

  .controller('ExecutionFilesCtrl',['$scope', '$mdDialog', 'settingsObject',
    function($scope, $mdDialog, settingsObject) {
      var executionFiles = {};
      var thumbnailRemoteURIArray = []
      angular.forEach(settingsObject, function(value, key) {
        console.log('key:' + key + ' value: ' + value);
          if(key === 'backupURI') {executionFiles.backupURI = value}
          if(key === 'inputURI') {executionFiles.inputURI = value}
          if(key === 'mp4Location') {executionFiles.mp4Location = value}
          if(key === 'spritesheetOutputURI') {executionFiles.spritesheetOutputURI = value}
          if(key === 'spritesheetRemoteURI') {executionFiles.spritesheetRemoteURI = value}
          if(key === 'spritesheetRemoteURL') {executionFiles.spritesheetRemoteURL = value}
          if(key === 'streamAvailableURLs') {
            if(value[0]) {
              executionFiles.streamAvailableURLs = value
            }
          }
          if(key === 'streamRemoteURIs') {
            if(value[0]){
              executionFiles.streamRemoteURIs = [];
              if(value[4]) {
                executionFiles.streamRemoteURIs[0] = value[0];
                executionFiles.streamRemoteURIs[1] = value[4];
              } else if (value[2]) {
                executionFiles.streamRemoteURIs[0] = value[2];
              } else {
                executionFiles.streamRemoteURIs[0] = value[0];
              }
            }
          }
          if(key === 'streams') {
            if(value[0]){
              executionFiles.streams = [];
              if(value[4]) {
                executionFiles.streams[0] = value[0];
                executionFiles.streams[1] = value[4];
              } else if (value[2]) {
                executionFiles.streams[0] = value[2];
              } else {
                executionFiles.streams[0] = value[0];
              }
            }
          }
          if(key === 'thumbnailRemoteURIs') {
            if(value[0]) {
              executionFiles.thumbnailRemoteURIs = [];
              angular.forEach(value, function(thumbnailValue, thumbnailKey) {
                executionFiles.thumbnailRemoteURIs.push(thumbnailValue);
              });
            }
          }
          if(key === 'videoOutputURI') {executionFiles.videoOutputURI = value}
          if(key === 'vttOutputURI') {executionFiles.vttOutputURI = value}
          if(key === 'vttRemoteURI') {executionFiles.vttRemoteURI = value}
          if(key === 'vttRemoteURL') {executionFiles.vttRemoteURL = value}
      });
      $scope.executionFiles = executionFiles;
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
