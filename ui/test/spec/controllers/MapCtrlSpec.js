describe('MapCtrl', function() {
  beforeEach(module('uiApp'));

  var $controller, ctrl, scope;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = {};
    ctrl = $controller('MapCtrl', { $scope: scope });
  }));

  describe('$scope.alta', function() {
    it('should be set correctly', function() {
      var expected = {
        lat: 40.5888,
        lng: -111.6380,
        zoom: 14
      };

      expect(scope.alta).toEqual(expected);
    });
  });
});
