'use strict';

/*global app: false */
app.controller('AddStashModalCtrl', ['$uibModalInstance', '$scope', 'UserFactory', function($uibModalInstance, $scope, UserFactory) {

  var userPromise = UserFactory.get();

  $scope.addStash = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss();
  };

  $scope.position = {};

  $scope.$on("leafletDirectiveMarker.dragend", function(event, args){
      $scope.position.lat = args.model.lat;
      $scope.position.lng = args.model.lng;
  });

  $scope.postStash = function() {
      UserFactory.get().then(function(response){
          console.log(response);
//            StashService.addStash({"name": "Something", "location": {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-111.6, 40.5888]}}}).then(function(response){
//                      $scope.refreshStashes();
//            });
      });
  };

}]);
