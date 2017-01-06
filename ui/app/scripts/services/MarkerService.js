'use strict';

/*global app: false */
app.factory('MarkerService', ['lodash', function(_) {
  return {
    getMarkers: function(stash) {
      var geometry = stash.location.geometry;

      var getLatLngs = function() {
         if(geometry.type === "Point") {
            return [geometry.coordinates];
         } else if(geometry.type == "Polygon") {
            var latLng = geometry.coordinates[0];
            return [latLng];
         } else {
            var firstLatLng = geometry.coordinates[0];
            var lastLatLng = geometry.coordinates[geometry.coordinates.length - 1]
            return [firstLatLng, lastLatLng];
         }
      };

      var latLngs = getLatLngs();
      return _.flatMap(latLngs, function(next){
        return {
          message: stash.name,
          lat: next[1],
          lng: next[0]
        };
      });
    }
  };
}]);
