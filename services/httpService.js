
angular.module('SharedHTTP', [])

.factory('HTTPService', ['$http', function($http) {
    
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

    // post: function(data, url, callback) {
    //     $http.post(url, data).
    //     success(function(data, status) {
    //       callback(true);
    //     }).
    //     error(function(data, status, headers, config) {
    //       console.error('error with Create Item POST.' + status, data);
    //       callback(false);
    //     });
    //  },
     
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
     
    //  deleteItem: function(idOne, idTwo, url, callback) {
    //     if(!idTwo){
    //         $http.delete(url + idOne).
    //          success(function(data, status, headers, config) {
    //           console.log('Success - Item Deleted');
    //           callback(true);
    //         }).
    //         error(function(data, status, headers, config) {
    //           console.error('error!' + status, data);
    //           callback(false);
    //         });
    //     }else{
    //         $http.delete(url + idOne + '/' + idTwo).
    //          success(function(data, status, headers, config) {
    //           console.log('Success - Item Deleted');
    //           callback(true);
    //         }).
    //         error(function(data, status, headers, config) {
    //           console.error('error!' + status, data);
    //           callback(false);
    //         });
    //     }
    //  }
     
  };
}]);
