
angular.module('SharedHTTP', [])

.factory('HTTPService', ['$http', '$q', function($http, $q) {
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
