describe("StashService", function () {
  var stashService, httpBackend;

  beforeEach(module("uiApp"));

  beforeEach(inject(function (_StashService_, $httpBackend) {
    stashService = _StashService_;
    httpBackend = $httpBackend;
  }));

  it("should load stashes", function () {
    var stashes = [someRandom.object(), someRandom.object()];
    httpBackend.whenGET('/stash').respond(200, stashes);

    var actualStashes;
    stashService.getStashes().then(function(returnFromPromise) {
      actualStashes = returnFromPromise.data;
    });
    httpBackend.flush();

    expect(actualStashes).toEqual(stashes);
  });
});
