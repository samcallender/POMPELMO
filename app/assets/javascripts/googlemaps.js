function initMap() {
  var customMapType = new google.maps.StyledMapType([
    {
        "featureType": "administrative.locality",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#2c2e33"
            },
            {
                "saturation": 7
            },
            {
                "lightness": 19
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 100
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#bbc0c4"
            },
            {
                "saturation": -93
            },
            {
                "lightness": 31
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "hue": "#bbc0c4"
            },
            {
                "saturation": -93
            },
            {
                "lightness": 31
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels",
        "stylers": [
            {
                "hue": "#bbc0c4"
            },
            {
                "saturation": -93
            },
            {
                "lightness": -2
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#e9ebed"
            },
            {
                "saturation": -90
            },
            {
                "lightness": -8
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#e9ebed"
            },
            {
                "saturation": 10
            },
            {
                "lightness": 69
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#e9ebed"
            },
            {
                "saturation": -78
            },
            {
                "lightness": 67
            },
            {
                "visibility": "simplified"
            }
        ]
    }
], {
	      name: 'Custom Style'
	  });
	  var customMapTypeId = 'custom_style';

	  var map = new google.maps.Map(document.getElementById('map'), {
	    zoom: 12,
	    center: {lat: 40.758765, lng: -73.985206},  // Times Square
	    mapTypeControlOptions: {
	      mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
	    }
	  });

	  map.mapTypes.set(customMapTypeId, customMapType);
	  map.setMapTypeId(customMapTypeId);

	  console.log('initmap from googlemaps.js');
}


var getMarkers = function(){
	$(function(){
		$.ajax({
			url: '/missed_connections.json',
			datatype: 'json',
			success: function(data){
				for ( var i = 0; i < data.length; i++ ) {
					// plotMarker( data[i].coordinate )
                    // debugger;
                    console.log(data[i].headline);

                    // BEGIN PLACING MARKERS
                    var headline = data[i].headline
                    var latitude = +data[i].latitude
                    var longitude = +data[i].longitude
                    var markerLatLng = {lat: latitude, lng: longitude};

                    // debugger;
                    var marker = new google.maps.Marker({
                        // position: markerLatLng,
                        position: {lat: 41.013, lng: -74.1243},
                        map: map,
                        title: headline
                    });
                    // END PLACING MARKERS
				}
			}
		})
	})
}

getMarkers();

// stuff i was working on with jessie

// var plotMarker = function ( coordinate ) {
// 	var x = coordinate.x;
// 	var y = coordinate.x
// }

// coordinate = { x: xval, y: yval }