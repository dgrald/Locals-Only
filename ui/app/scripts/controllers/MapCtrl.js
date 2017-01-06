'use strict';

/*global app: false */
app.controller('MapCtrl', ['$rootScope', '$scope', '$alert', 'UserFactory', 'StashService', 'MarkerService', 'lodash', 'leafletBoundsHelpers', '$uibModal', function($rootScope, $scope, $alert, UserFactory, StashService, MarkerService, _, leafletBoundsHelpers, $uibModal) {

    $scope.center = {
      lat: 40.5888,
      lng: -111.6380,
      zoom: 14
    };

    var mapbox_outdoors = {
        name: 'Mapbox Outdoors',
        url: '//api.mapbox.com/styles/v1/{user}/{mapId}/tiles/256/{z}/{x}/{y}?access_token={apiKey}',
        type: 'xyz',
        options: {
            user: 'dgrald',
            apiKey: 'pk.eyJ1IjoiZGdyYWxkIiwiYSI6ImNpanJoaXRhYjBha2Z0aG01OW1ha3Q5ZG4ifQ.oVkcFro9ahsr9cLcZgoTgg',
            mapId: 'ciu7h14go00082hqnzimmf3oq'
        }
    };

    $scope.tiles = mapbox_outdoors;

    $scope.refreshStashes = function() {
        StashService.getStashes().then(function(response){
            var geojsonData = _.map(response.data, function(next) {
              return next.location;
            });

            $scope.geojson = {
              data: geojsonData
            };

            var markers = _.flatMap(response.data, function(next){
              return MarkerService.getMarkers(next);
            });
            $scope.markers = markers;
        });
    };

    $scope.refreshStashes();

    $scope.addStash = function() {
      var modalInstance = $uibModal.open({
        template: '<div class="modal-header">Add Stash</div>' +
          '<div class="modal-body"><leaflet width="100%" height="480px" lf-center="center" tiles="tiles"></leaflet></div>' +
          '<div class="modal-footer"><button class="btn btn-primary" ng-click="addStash()">Add Stash</button><button class="btn btn-default" ng-click="cancel()">Cancel</button></div>',
        controller: 'AddStashModalCtrl',
        scope: angular.merge($rootScope, {
          center: $scope.center,
          tiles: $scope.tiles
        })
      });

      modalInstance.result.then(function (selectedItem) {
          console.log(selectedItem);
      }, function () {

      });
    };
}]);
