'use strict';

/*global app: false */
app.factory('SomeRandom', function() {
  return {
    string: function() {
      return Math.random().toString(36).substr(2, 5);
    },
    object: function() {
      var toReturn = {};
      for(var i = 0; i < 5; i++) {
        toReturn[this.string()] = this.string();
      }
      return toReturn;
    }
  };
});
