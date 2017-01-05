'use strict';

/*global app: false */
app.factory('MarkerService', ['lodash', function(_) {
  return {
    getMarkers: function(stash) {
      var geometry = stash.location.geometry;

      var getLatLng = function() {
         if(geometry.type === "Point") {
            var lng = geometry.coordinates[0];
            var lat = geometry.coordinates[1];
            return [lng, lat];
         } else {
            var latLng = geometry.coordinates[0];
            return latLng;
         }
      };

      var latLng = getLatLng();
      var lng = latLng[0];
      var lat = latLng[1];
      return {
        message: stash.name,
        lat: lat,
        lng: lng
      };
    }
  };
}]);
