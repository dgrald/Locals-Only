'use strict';

/*global app: false */
app.controller('MapCtrl', ['$rootScope', '$scope', '$alert', 'UserFactory', function($rootScope, $scope, $alert, UserFactory) {

    $scope.alta = {
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

}]);
