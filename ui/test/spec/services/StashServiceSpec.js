describe("StashService", function () {
  var userService, httpBackend, someRandom;

  beforeEach(module("uiApp"));

  beforeEach(inject(function (_StashService_, $httpBackend, _SomeRandom_) {
    userService = _StashService_;
    httpBackend = $httpBackend;
    someRandom = _SomeRandom_;
  }));

  it("should load stashes", function () {
    var stashes = [someRandom.object(), someRandom.object()];
    httpBackend.whenGET('/stash').respond(200, stashes);

    var actualStashes;
    userService.getStashes().then(function(returnFromPromise) {
      actualStashes = returnFromPromise.data;
    });
    httpBackend.flush();

    expect(actualStashes).toEqual(stashes);
  });
});
