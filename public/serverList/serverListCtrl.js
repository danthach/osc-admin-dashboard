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
      // $interval.cancel($scope.selectExecutionPromise);
      $interval.cancel($scope.getThisExecutionPromise);
      $interval.cancel($scope.getExecutionsPromise);
      $interval.cancel($scope.selectStepPromise);
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

    $scope.showExecSearch = function() {
      $scope.reasonForSearch = !$scope.reasonForSearch;
      $interval.cancel($scope.getExecutionsPromise);
      $interval.cancel($scope.getThisExecutionPromise);
      $interval.cancel($scope.selectStepPromise);
      $interval.cancel($scope.selectTaskPromise);
      $scope.highlightSelectedExec = '';
      $scope.highlightSelectedTask = '';
      $scope.highlightSelectedStep = '';
      $scope.executionPing = '';
      $scope.thisStep = '';
    };

    $scope.startExecutionInterval = function(indexE, resultsE, e) {
      //kill off existing intervals
      $interval.cancel($scope.getThisExecutionPromise);
      $interval.cancel($scope.getExecutionsPromise);
      $interval.cancel($scope.selectStepPromise);
      $interval.cancel($scope.selectTaskPromise);
      $scope.highlightSelectedTask = undefined;
      $scope.highlightSelectedStep = undefined;
      $scope.newExecutionClick = true;
      $scope.selectExecution(indexE, resultsE, e);
      // $scope.selectExecutionPromise = $interval($scope.selectExecution, 10000, false);
      $scope.getThisExecutionPromise = $interval($scope.getThisExecution, 30000, false);
      $scope.getExecutionsPromise = $interval($scope.getExecutions, 30000, false, indexE, resultsE, e);
    };

    //index is where you are in the array
    //results can be an array of searched results, or it can be an object of previous result.
    //e is the search string
    //when interval runs, all the parameters become undefined
    $scope.selectExecution = function(indexE, resultsE, e) {
      //set currentExecsLen to executions.executions.length initially
      if(!$scope.previousExecsLen) {
        $scope.previousExecsLen = angular.copy($scope.executions.executions).length;
      }
      if($scope.previousExecsLen === $scope.executions.executions.length) {
        if(e || e === ""){
          $interval.cancel($scope.selectExecutionPromise);
          $interval.cancel($scope.getThisExecutionPromise);
          $interval.cancel($scope.getExecutionsPromise);
          if(Array.isArray(resultsE)) {
            //create new object of initial results
            $scope.originalExecResultsObj = angular.copy(resultsE);
            var resultUrls = {};
            if(resultsE[indexE].ping) {resultUrls.ping = resultsE[indexE].ping}
            if(resultsE[indexE].restart) {resultUrls.restart = resultsE[indexE].restart}
            if(resultsE[indexE].kill) {resultUrls.kill = resultsE[indexE].kill}
            if(resultsE[indexE].pause) {resultUrls.pause = resultsE[indexE].pause}
            if(resultsE[indexE].resume) {resultUrls.resume = resultsE[indexE].resume}
            if(resultsE[indexE].force) {resultUrls.resume = resultsE[indexE].force}
            $scope.thisExecutionUrl = resultUrls;
            $scope.executionPingUrl = resultsE[indexE].ping + '?callback=JSON_CALLBACK';
            //a search counts as a new click
            $scope.newExecutionClick = false;
          } else if (resultsE !== undefined) {
            //display original execution list after a search, e= ""
            var resultUrls = {};
            if($scope.originalExecResultsObj[indexE].ping) {resultUrls.ping = $scope.originalExecResultsObj[indexE].ping}
            if($scope.originalExecResultsObj[indexE].restart) {resultUrls.restart = $scope.originalExecResultsObj[indexE].restart}
            if($scope.originalExecResultsObj[indexE].kill) {resultUrls.kill = $scope.originalExecResultsObj[indexE].kill}
            if($scope.originalExecResultsObj[indexE].pause) {resultUrls.pause = $scope.originalExecResultsObj[indexE].pause}
            if($scope.originalExecResultsObj[indexE].resume) {resultUrls.resume = $scope.originalExecResultsObj[indexE].resume}
            if($scope.originalExecResultsObj[indexE].force) {resultUrls.resume = $scope.originalExecResultsObj[indexE].force}
            $scope.thisExecutionUrl = resultUrls;
            $scope.executionPingUrl = $scope.originalExecResultsObj[indexE].ping + '?callback=JSON_CALLBACK';
            //a search counts as a new click
            $scope.newExecutionClick = false;
          } else {
            //after a search, interval runs, which doesn't return indexE, result, or e
            $scope.thisExecutionUrl = $scope.executionUrls[indexE];
            $scope.executionPingUrl = $scope.executionUrls[indexE].ping + '?callback=JSON_CALLBACK';
            $scope.newExecutionClick = false;
          }
        } else {
          if(Array.isArray(resultsE)) {
            if(!$scope.operationUpdate) {
              $scope.originalExecResultsObj = angular.copy(resultsE);
            }
          }
          //when the interval runs, the index does not become the index anymore so we stored the previous index in $scope.selectedExecIndex
          if(!$scope.newExecutionClick && indexE != $scope.selectedExecIndex) {
            indexE = $scope.selectedExecIndex;
          }
          if(!$scope.executionPingUrl && e !== "") {
            if($scope.executionUrls) {
              //user clicks search but doesn't enter any value in field
              $scope.thisExecutionUrl = $scope.executionUrls[indexE];
              $scope.executionPingUrl = $scope.executionUrls[indexE].ping + '?callback=JSON_CALLBACK';
            } else {
              // $scope.thisExecutionUrl = executionUrls[indexE];
              // $scope.executionPingUrl = executionUrls[indexE].ping + '?callback=JSON_CALLBACK';
            }
          } else if ($scope.originalExecResultsObj) {
              if(Array.isArray($scope.originalExecResultsObj) && !$scope.executionPingUrl) {
                var resultUrls = {};
                if($scope.originalExecResultsObj[indexE].ping) {resultUrls.ping = $scope.originalExecResultsObj[indexE].ping}
                if($scope.originalExecResultsObj[indexE].restart) {resultUrls.restart = $scope.originalExecResultsObj[indexE].restart}
                if($scope.originalExecResultsObj[indexE].kill) {resultUrls.kill = $scope.originalExecResultsObj[indexE].kill}
                if($scope.originalExecResultsObj[indexE].pause) {resultUrls.pause = $scope.originalExecResultsObj[indexE].pause}
                if($scope.originalExecResultsObj[indexE].resume) {resultUrls.resume = $scope.originalExecResultsObj[indexE].resume}
                if($scope.originalExecResultsObj[indexE].force) {resultUrls.resume = $scope.originalExecResultsObj[indexE].force}
                $scope.thisExecutionUrl = resultUrls;
                $scope.executionPingUrl = $scope.originalExecResultsObj[indexE].ping + '?callback=JSON_CALLBACK';
              }
              else if (Array.isArray($scope.originalExecResultsObj) && $scope.newExecutionClick) {
                var resultUrls = {};
                if($scope.originalExecResultsObj[indexE].ping) {resultUrls.ping = $scope.originalExecResultsObj[indexE].ping}
                if($scope.originalExecResultsObj[indexE].restart) {resultUrls.restart = $scope.originalExecResultsObj[indexE].restart}
                if($scope.originalExecResultsObj[indexE].kill) {resultUrls.kill = $scope.originalExecResultsObj[indexE].kill}
                if($scope.originalExecResultsObj[indexE].pause) {resultUrls.pause = $scope.originalExecResultsObj[indexE].pause}
                if($scope.originalExecResultsObj[indexE].resume) {resultUrls.resume = $scope.originalExecResultsObj[indexE].resume}
                if($scope.originalExecResultsObj[indexE].force) {resultUrls.resume = $scope.originalExecResultsObj[indexE].force}
                $scope.thisExecutionUrl = resultUrls;
                $scope.executionPingUrl = $scope.originalExecResultsObj[indexE].ping + '?callback=JSON_CALLBACK';
              }
          } else {
              //after a search, interval runs, which doesn't return indexE, result, or e
              $scope.thisExecutionUrl = $scope.executionUrls[indexE];
              $scope.executionPingUrl = $scope.executionUrls[indexE].ping + '?callback=JSON_CALLBACK';
          }
          $scope.newExecutionClick = false;
        }
        if(indexE != undefined) {
          //save the index so when interval runs, it remembers previous index
          $scope.selectedExecIndex = indexE;
        }
      } else {
        //shift the index the difference of currentExecsLen and executions.executions.length
        var indexDifference = $scope.executions.executions.length - $scope.previousExecsLen;
        $scope.selectedExecIndex = $scope.selectedExecIndex + indexDifference;
        $scope.previousExecsLen = $scope.executions.executions.length;
      }
      // $scope.thisStep = undefined;
      // $scope.thisTask = undefined;
      $scope.highlightSelectedExec = function(indexE) {
        return indexE === $scope.selectedExecIndex ? 'highlight-select' : undefined;
      };
      $scope.getThisExecution();
    };

    $scope.getThisExecution = function() {
      HTTPService.jsonp($scope.executionPingUrl, function(data) {
          $scope.executionPing = data;
      });
    };

    $scope.getExecutions = function(indexE, results, e) {
      HTTPService.jsonp($scope.serverUrl, function(data) {
          $scope.executions = data;
          $scope.getExecutionUrls();
          $scope.selectExecution(indexE, results, e);
      });
    };

    $scope.getExecutionUrls = function() {
        var justUrls = [];
        var executionResult = $scope.executions.executions;
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
        $scope.executionUrls = justUrls;
    };

    $scope.selectOperation = function(operationUrl, resultsExec) {
        $scope.thisOperationUrl = operationUrl + '?callback=JSON_CALLBACK';
        $scope.performOperation(operationUrl, resultsExec);
    };

    $scope.performOperation = function(operationUrl, resultsExec) {
      HTTPService.jsonp($scope.thisOperationUrl, function(data) {
          //$scope.operationResponse = data;
          $scope.operationResponse = data;
          $scope.showOperationResponse(event);
          $scope.getThisExecution();
          $scope.operationUpdate = true;
          $scope.getExecutions($scope.selectedExecIndex, resultsExec, undefined);
      });
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

    $scope.startStepInterval = function(indexS, results, e) {
      //kill off existing intervals
      $interval.cancel($scope.selectStepPromise);
      $scope.newStepClick = true;
      $scope.selectStep(indexS, results, e);
      $scope.selectStepPromise = $interval($scope.selectStep, 15000, false);
    };

    $scope.selectStep = function(indexS, results, s) {
      if(!$scope.newStepClick && indexS != $scope.selectedStepIndex) {
        indexS = $scope.selectedStepIndex;
      }
      $scope.newStepClick = false;
      if(results){
        $scope.thisStep = results[indexS];
      } else {
        $scope.thisStep = $scope.executionPing.message.executionDetails.steps[indexS];
      }
      //$scope.thisTask = undefined;
      if(indexS != undefined) {
        $scope.selectedStepIndex = indexS;
      }
      console.log($scope.thisStep);
      $scope.highlightSelectedStep = function(indexS) {
        return indexS === $scope.selectedStepIndex ? 'highlight-select' : undefined;
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

    $scope.startTaskInterval = function(indexT, results, e) {
      //kill off existing intervals
      $interval.cancel($scope.selectTaskPromise);
      $scope.newTaskClick = true;
      $scope.showTaskDetails(indexT, results, e);
      $scope.selectTaskPromise = $interval($scope.showTaskDetails, 15000, false);
    };

    $scope.showTaskDetails = function(indexT, results, t) {
      if(!$scope.newTaskClick && indexT != $scope.selectedTaskIndex) {
        indexT = $scope.selectedTaskIndex;
      }
      $scope.newTaskClick = false;
      if(results) {
        $scope.thisTask = results[indexT];
      } else {
        $scope.thisTask = $scope.thisStep.tasks[indexT];
      }
      //$scope.thisTask = undefined;
      if(indexT != undefined) {
        $scope.selectedTaskIndex = indexT;
      }

      $scope.highlightSelectedTask = function(indexT) {
        return indexT === $scope.selectedTaskIndex ? 'highlight-select' : undefined;
      };
      console.log($scope.thisTask);
      angular.forEach($scope.thisTask, function(value, key) {
        if (typeof value === "undefined") {
          $scope.thisTask[key] = "undefined";
        } else if (value === null) {
          $scope.thisTask[key] = "null";
        }
      });
      if(event) {
        $scope.openTaskModal();
      }
    };

    $scope.openTaskModal = function() {
      $mdDialog.show({
        controller: 'TaskStatusModalCtrl',
        templateUrl: 'serverList/templates/taskStatusModal.html',
        parent: angular.element(document.body),
        targetEvent: event,
        locals: {
          thisTask: $scope.thisTask
        }
      });
    }
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
