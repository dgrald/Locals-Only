'use strict';

/*global app: false */
app.factory('StashService', function($http) {
  return {
    getStashes: function() {
      return $http.get('/stash');
    }
  };
});
