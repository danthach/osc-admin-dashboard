
angular.module('SharedHTTP', [])
.factory('HTTPService', ['$http', '$q', '$timeout', function($http, $q, $timeout) {
  return {

    get: function(url, callback){
        $http.get(url).success(function(data) {
        console.log('Success getting ' + url + ' Data = ', data);
        callback(data);
      }).
       error(function(data, status, headers, config) {
          console.error('error with GET product list request.' + status, data);
          callback(false);
        });
    },

    //we want to display offline servers, so we are working on errored data.
    jsonpServer: function(url, callback) {
        $http.jsonp(url).success(function(data) {
          //console.log(data);
          callback(data);
        }).
        error(function(data, status, headers, config) {
          callback(data);
        })
    },

    jsonpExec: function(url, callback) {
        var blah = { startTime: new Date().getTime() };
        //time out the request after 3 mins
        var timeoutPromise = $timeout( function() {
          canceler.resolve();
          console.log("Timed out");
        } , 180000);
        var canceler = $q.defer();
        $http.jsonp(url, {timeout: canceler.promise}).
        success(function(data) {
          blah.endTime = new Date().getTime();
          console.log( '### call took ' + ((blah.endTime - blah.startTime) / 1000) + ' seconds' );
          $timeout.cancel(timeoutPromise);
          console.log(data);
          callback(data);
        }).
        error(function(data, status, headers, config) {
          callback(data);
        })
    },

    jsonp: function(url, callback) {
        $http.jsonp(url).success(function(data) {
          console.log(data);
          callback(data);
        }).
        error(function(data, status, headers, config) {
          console.error('error with GET.' + status, data);
        })
    },

    post: function(data, url, callback) {
        $http.post(url, data).
        success(function(data, status) {
            console.log('data = ', data);
            console.log('status = ', status);
          callback(true, data);
        }).
        error(function(data, status, headers, config) {
          console.error('error with Create Item POST.' + status, data);
          callback(false, data);
        });
     },

    // update: function(id, data, url, callback) {
    //     $http.put(url + id, data).
    //      success(function(data, status, headers, config) {
    //       console.log('Success - Item Updated', data, status, headers, config);
    //       callback(true, data);
    //     }).
    //     error(function(data, status, headers, config) {
    //       console.log('error!' + status, data);
    //       callback(false);
    //     });
    //  },

     deleteItem: function(id, url, callback) {
        $http.delete(url + id).
         success(function(data, status, headers, config) {
          console.log('Success - Item Deleted');
          callback(true);
        }).
        error(function(data, status, headers, config) {
          console.error('error!' + status, data);
          callback(false);
        });
     }

  };
}]);
