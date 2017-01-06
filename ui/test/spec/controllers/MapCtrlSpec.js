describe('MapCtrl', function() {
  beforeEach(module('uiApp'));

  var $controller, scope, stashService, MarkerService, _, $q, deferred;
  var createController, stash1Markers, stash2Markers, allStashMarkers, stash1, stash2, stash1Location, stash2Location, allStashes;

  beforeEach(inject(function(_$controller_, _$rootScope_, _StashService_, _$q_, _MarkerService_, _lodash_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = _$rootScope_.$new();
    stashService = _StashService_;
    MarkerService = _MarkerService_;
    _ = _lodash_;
    $q = _$q_;
    deferred = _$q_.defer();
    createController = function(){
          ctrl = $controller('MapCtrl', { $scope: scope, StashService: stashService, MarkerService: MarkerService });
     };

    stash1Location = someRandom.object();
    stash1 = {location: stash1Location};
    stash2Location = someRandom.object();
    stash2 = {location: stash2Location};
    allStashes = [stash1, stash2];

     stash1Markers = [someRandom.object(), someRandom.object()];
     stash2Markers = [someRandom.object()];
     allStashMarkers = stash1Markers.concat(stash2Markers);

     spyOn(MarkerService, 'getMarkers').and.callFake(function(input){
       if(_.isEqual(input, stash1)) {
         return stash1Markers;
       } else {
         return stash2Markers;
       }
     });
  }));

  describe('map center', function() {

    beforeEach(function(){
      createController();
    });

    it('$scope.center should be set correctly', function() {
      var expected = {
        lat: 40.5888,
        lng: -111.6380,
        zoom: 14
      };

      expect(scope.center).toEqual(expected);
    });
  });

  describe('loading of the data', function(){
      beforeEach(function(){
        spyOn(stashService, 'getStashes').and.returnValue(deferred.promise);
        deferred.resolve({data: allStashes});
        createController();
      });

    describe('refreshStashes', function(){

      it('should load the stashes', function() {
        var expected = {data: [stash1Location, stash2Location]};

        scope.$digest();

        expect(scope.geojson).toEqual(expected);
      });

      it('should load the correct markers', function(){
        scope.$digest();

        expect(scope.markers).toEqual(allStashMarkers);
      });
    });
  });
});
