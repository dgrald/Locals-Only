'use-strict';

app.directive('mapPage', function() {
  return {
    template: '<div style="padding-bottom: 4px;">' +
       '<leaflet lf-center="center" tiles="tiles" geojson="geojson" markers="markers" width="100%" height="480px"></leaflet>' +
        '</div><button type="button" class="btn btn-primary" ng-click="addStash()">Add Stash</button>',
    controller: 'MapCtrl'
  };
});
