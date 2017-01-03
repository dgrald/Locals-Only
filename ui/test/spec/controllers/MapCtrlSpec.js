describe('MapCtrl', function() {
  beforeEach(module('uiApp'));

  var $controller, ctrl, scope;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    scope = {};
    ctrl = $controller('MapCtrl', { $scope: scope });
  }));

  describe('$scope.message', function() {
    it('should be set correctly', function() {
      expect(scope.message).toEqual("Hello, it's me!");
    });
  });
});
