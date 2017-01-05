describe('MarkerService', function(){

  var markerService;

  beforeEach(module("uiApp"));

  beforeEach(inject(function (_MarkerService_) {
    markerService = _MarkerService_;
  }));

  describe('getMarkers', function(){
    it('should transform a Point location to an array of one marker', function(){
        var lat = 22;
        var lng = 44;
        var name = someRandom.string();
        var point = {
            name: name,
            location: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [lng, lat]
              }
            }
        };

        var actual = markerService.getMarkers(point);

        var expected = {
             lat: lat,
             lng: lng,
             message: name,
        };
        expect(actual).toEqual(expected);
    });

    describe('LineString and Polygon', function(){
      var lat1, lng1, lat2, lng2, coordinates, name, expected;
      beforeEach(function(){
         lat1 = 22;
         lng1 = 44;
         lat2 = 33;
         lng2 = 55;
         coordinates = [[lng1, lat1], [lng2, lat2]];
         name = someRandom.string();
         expected = {
            lat: lat1,
            lng: lng1,
            message: name,
          };
      });

      it('should transform a LineString location to an array of markers', function(){
          var point = {
              name: name,
              location: {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: coordinates
                }
              }
          };

          var actual = markerService.getMarkers(point);

          expect(actual).toEqual(expected);
      });

      it('should transform a Polygon location to an array of markers', function(){
          var point = {
              name: name,
              location: {
                type: "Feature",
                geometry: {
                  type: "Polygon",
                  coordinates: coordinates
                }
              }
          };

          var actual = markerService.getMarkers(point);

          expect(actual).toEqual(expected);
      });
    });
  });
});
